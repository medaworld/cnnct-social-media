import mongoose from 'mongoose';
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: './.env.local' });

export const dbUrl = process.env.MONGO_URI!;
export const secret = process.env.SESSION_SECRET || 'thisshouldbeasecret';
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60,
});

store.on('error', (e: any) => {
  console.log('SESSION STORE ERROR', e);
});

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

export { store };
