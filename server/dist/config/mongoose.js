"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.secret = exports.dbUrl = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: './.env.local' });
exports.dbUrl = process.env.MONGO_URI;
exports.secret = process.env.SESSION_SECRET || 'thisshouldbeasecret';
const store = MongoStore.create({
    mongoUrl: exports.dbUrl,
    secret: exports.secret,
    touchAfter: 24 * 60 * 60,
});
exports.store = store;
store.on('error', (e) => {
    console.log('SESSION STORE ERROR', e);
});
mongoose_1.default.connect(exports.dbUrl);
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});
