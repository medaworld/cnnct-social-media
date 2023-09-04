import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import socketIo from 'socket.io';
import { secret, store } from './config/mongoose';
import { setCurrentUser } from './middleware/setCurrentUser';
import User from './models/User';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import userRoutes from './routes/users';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import graphqlSchema from './graphql/schema';
import graphqlResolvers from './graphql/resolvers';
import isAuthenticated from './middleware/isAuthenticated';
import multer from 'multer';
import { storage, userImageStorage } from './config/cloudinary';
import Message from './models/Message';
import Conversation from './models/Conversation';
import { getUserIdFromToken } from './utils/authUtils';

require('dotenv').config({ path: './.env.local' });

const port = process.env.PORT || 8080;
const app = express();

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

app.use(cors());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(setCurrentUser);
app.use(express.json());

app.use(isAuthenticated);
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(error: any) {
      if (!error.originalError) {
        return error;
      }
      const data = error.originalError.data;
      const message = error.message || 'An error occurred';
      const code = error.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

passport.use(new LocalStrategy(User.authenticate()));
passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => done(err, false));
  })
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/user', userRoutes);

const upload = multer({ storage });
app.post(
  '/upload-image',
  upload.single('image'),
  async (req: any, res, next) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated');
      throw error;
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided' });
    }

    return res.status(201).json({
      message: 'File stored.',
      filePath: req.file.path,
      publicId: req.file.filename,
    });
  }
);

const userImageUpload = multer({ storage: userImageStorage });
app.post(
  '/upload-user-image',
  userImageUpload.single('image'),
  async (req: any, res, next) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated');
      throw error;
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided' });
    }

    return res.status(201).json({
      message: 'File stored.',
      filePath: req.file.path,
      publicId: req.file.filename,
    });
  }
);

app.post('/start-conversation', async (req: any, res) => {
  if (!req.isAuth) {
    const error = new Error('Not authenticated');
    throw error;
  }
  const currentUserId = req.userId;
  const recipientId = req.body.userId;

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [currentUserId, recipientId],
      });
      await conversation.save();
    }

    res.json({ conversationId: conversation._id });
  } catch (err) {
    console.error('Error in startOrFetchConversation:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const server = app.listen(port);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const socketToUserIdMap = new Map();

io.on('connection', (socket: socketIo.Socket) => {
  socket.on('authenticate', (token: string) => {
    const userId = getUserIdFromToken(token);
    if (userId) {
      socketToUserIdMap.set(socket.id, userId);
      console.log(`Authenticated socket ${socket.id} for user ${userId}`);
    } else {
      console.error('Failed to authenticate socket', socket.id);
    }
  });

  socket.on('join_room', async (conversationId: string) => {
    socket.join(conversationId);

    try {
      const senderId = socketToUserIdMap.get(socket.id);
      const conversation = await Conversation.findById(conversationId).populate(
        {
          path: 'participants',
          select: 'username image',
        }
      );
      const recipient = conversation.participants.find(
        (participant: { _id: Object }) => {
          return participant._id.toString() !== senderId;
        }
      );

      if (!conversation) {
        console.error(`Conversation with ID ${conversationId} not found.`);
        return;
      }

      const previousMessages = await Message.find({
        conversation: conversationId,
      })
        .sort('createdAt')
        .limit(20);

      socket.emit('initial_data', {
        recipient: recipient,
        messages: previousMessages,
      });
    } catch (err) {
      console.error('Error fetching previous messages:', err);
    }
  });

  socket.on(
    'send_message',
    async (conversationId: string, messageContent: string) => {
      const senderId = socketToUserIdMap.get(socket.id);

      if (!senderId) {
        console.error('Failed to find sender for this socket connection.');
        return;
      }

      io.to(conversationId).emit('receive_message', {
        sender: senderId,
        content: messageContent,
        createdAt: new Date(),
      });

      try {
        const newMessage = new Message({
          content: messageContent,
          sender: senderId,
          conversation: conversationId,
        });
        await newMessage.save();
      } catch (err) {
        console.error('Error saving message:', err);
      }
    }
  );

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
