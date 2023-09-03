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
import { cloudinary, storage } from './config/cloudinary';
const upload = multer({ storage });

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

    const result = await cloudinary.uploader.upload(req.file.path);

    return res.status(201).json({
      message: 'File stored.',
      filePath: result.url,
      publicId: `${process.env.CLOUDINARY_FOLDER}/${result.original_filename}`,
    });
  }
);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const server = app.listen(port);
const io = require('socket.io')(server, { cors: { origin: '*' } });

io.on('connection', (socket: socketIo.Socket) => {
  console.log('Client connected');

  socket.on('send_message', (message: string) => {
    console.log(`Message received: ${message}`);
    io.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
