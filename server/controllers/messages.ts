import socketIo from 'socket.io';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { getUserIdFromToken } from '../utils/authUtils';

export const handleSocketMessages = (
  io: any,
  socketToUserIdMap: Map<string, string>
) => {
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
        const conversation: any = await Conversation.findById(
          conversationId
        ).populate({
          path: 'participants',
          select: 'username image',
        });
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
};
