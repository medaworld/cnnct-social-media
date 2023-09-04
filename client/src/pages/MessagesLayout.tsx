import { useEffect, useState } from 'react';
import { getAuthToken } from '../utils/authUtils';
import { Outlet } from 'react-router-dom';
import MessageList from '../components/Messages/MessagesList';
import { FaEnvelope } from 'react-icons/fa';
import Loader from '../components/Common/Loader';

type Conversation = {
  _id: string;
  updatedAt: string;
  recipient: any;
};

export default function MessagesLayout() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        const response = await fetch(
          `${process.env.REACT_APP_API}/conversation/get-conversation`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchConversations();
  }, []);

  return (
    <div className="flex w-full h-full min-h-screen ">
      <div className="md:w-2/6 bg-gray-200">
        {conversations.length === 0 ? (
          <div>
            <div className="flex items-center justify-center md:justify-start text-2xl font-semibold p-4">
              <div className="flex items-center justify-center w-12">
                <FaEnvelope />
              </div>

              <span className="ml-3 hidden md:inline">Messages</span>
            </div>
            {isLoading ? (
              <Loader />
            ) : (
              <span className="p-4 md:text-xl hidden md:inline">
                There are no conversations
              </span>
            )}
          </div>
        ) : (
          <MessageList conversations={conversations} />
        )}
      </div>
      <div className="w-full md:w-4/6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
