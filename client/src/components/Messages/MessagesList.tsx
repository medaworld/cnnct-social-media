import { FaEnvelope, FaUser } from 'react-icons/fa';
import CustomNavLink from '../Common/CustomNavLink';

type Conversation = {
  _id: string;
  updatedAt: string;
  recipient: any;
};

export default function MessageList({
  conversations,
}: {
  conversations: Conversation[];
}) {
  return (
    <div>
      <div className="flex items-center justify-center md:justify-start text-2xl font-semibold p-4">
        <FaEnvelope />
        <span className="ml-3 hidden md:inline">Messages</span>
      </div>
      <ul>
        {conversations.map((conversation) => {
          return (
            <CustomNavLink
              className="block hover:bg-gray-300 flex justify-center md:justify-start"
              key={conversation._id}
              to={`/messages/${conversation._id}`}
            >
              <li className="flex items-center p-4 border-b ">
                <div className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden">
                  {conversation.recipient.image &&
                  conversation.recipient.image.url ? (
                    <img
                      src={conversation.recipient.image.url}
                      alt={conversation.recipient.username}
                      className="w-12 h-12 object-cover"
                    />
                  ) : (
                    <FaUser size={30} />
                  )}
                </div>

                <div className="hidden md:inline ml-3">
                  <p className="font-semibold">
                    {conversation.recipient.username}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(conversation.updatedAt).toLocaleString()}
                  </span>
                </div>
              </li>
            </CustomNavLink>
          );
        })}
      </ul>
    </div>
  );
}
