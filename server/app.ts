require('dotenv').config({ path: './.env.local' });
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import { secret, store } from './config/mongoose';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import cors from 'cors';
import { setCurrentUser } from './middleware/setCurrentUser';
import isAuthenticated from './middleware/isAuthenticated';
import { handleSocketMessages } from './controllers/messages';
import User from './models/User';
import { graphqlHTTP } from 'express-graphql';
import graphqlSchema from './graphql/schema';
import graphqlResolvers from './graphql/resolvers';
import userRoutes from './routes/users';
import conversationRoutes from './routes/conversations';
import imageRoutes from './routes/images';

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

app.use('/user', userRoutes);
app.use('/conversation', conversationRoutes);
app.use('/image', imageRoutes);

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
handleSocketMessages(io, socketToUserIdMap);
