import { NextFunction } from 'express';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

ConversationSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await mongoose.model('Message').deleteMany({ conversation: doc._id });
  }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;
