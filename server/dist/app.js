"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: './.env.local' });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = require("./config/mongoose");
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const cors_1 = __importDefault(require("cors"));
const setCurrentUser_1 = require("./middleware/setCurrentUser");
const isAuthenticated_1 = __importDefault(require("./middleware/isAuthenticated"));
const messages_1 = require("./controllers/messages");
const User_1 = __importDefault(require("./models/User"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./graphql/schema"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const users_1 = __importDefault(require("./routes/users"));
const conversations_1 = __importDefault(require("./routes/conversations"));
const images_1 = __importDefault(require("./routes/images"));
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
const sessionConfig = {
    store: mongoose_1.store,
    name: 'session',
    secret: mongoose_1.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)(sessionConfig));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(setCurrentUser_1.setCurrentUser);
app.use(express_1.default.json());
app.use(isAuthenticated_1.default);
passport_1.default.use(new passport_local_1.Strategy(User_1.default.authenticate()));
passport_1.default.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => {
    User_1.default.findById(jwt_payload.id)
        .then((user) => {
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    })
        .catch((err) => done(err, false));
}));
passport_1.default.serializeUser(User_1.default.serializeUser());
passport_1.default.deserializeUser(User_1.default.deserializeUser());
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.default,
    rootValue: resolvers_1.default,
    graphiql: true,
    customFormatErrorFn(error) {
        if (!error.originalError) {
            return error;
        }
        const data = error.originalError.data;
        const message = error.message || 'An error occurred';
        const code = error.originalError.code || 500;
        return { message: message, status: code, data: data };
    },
}));
app.use('/user', users_1.default);
app.use('/conversation', conversations_1.default);
app.use('/image', images_1.default);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});
const server = app.listen(port);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const socketToUserIdMap = new Map();
(0, messages_1.handleSocketMessages)(io, socketToUserIdMap);
