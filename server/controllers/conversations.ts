import Conversation from '../models/Conversation';

export const postConversation = async (req: any, res: any) => {
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
};

export const getConversation = async (req: any, res: any) => {
  if (!req.isAuth) {
    const error = new Error('Not authenticated');
    throw error;
  }

  const userId = req.userId;

  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: 'participants',
      select: 'username image',
    });

    const updatedConversations = conversations.map((conv: any) => {
      const recipient = conv.participants.find(
        (participant: { _id: Object }) => {
          return participant._id.toString() !== userId;
        }
      );
      const newConv = {
        ...conv._doc,
        recipient,
      };
      delete newConv.participants;
      return newConv;
    });

    return res.json(updatedConversations);
  } catch (err) {
    console.error('Error fetching user conversations:', err);
    res.status(500).send('Internal Server Error');
  }
};
