import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ sender: 1, read: 1 });

const Message = mongoose.model('Message', MessageSchema);

export default Message;
