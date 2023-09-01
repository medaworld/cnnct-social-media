import express from 'express';
import socketIo from 'socket.io';
import mongoose from 'mongoose';
require('dotenv').config({ path: './.env.local' });

const dbUrl = process.env.MONGO_URI!;

const app = express();

mongoose
  .connect(dbUrl)
  .then((result) => {
    const server = app.listen(8080);
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
  })
  .catch((err) => console.log(err));
