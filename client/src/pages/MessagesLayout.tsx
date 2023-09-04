import { useEffect, useState } from 'react';
import { getAuthToken } from '../utils/authUtils';
import { Outlet } from 'react-router-dom';
import MessageList from '../components/Messages/MessagesList';

type Conversation = {
  _id: string;
  updatedAt: string;
  recipient: any;
};

export default function MessagesLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const token = getAuthToken();
        const response = await fetch(
          'http://localhost:8080/user-conversations',
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
      }
    }

    fetchConversations();
  }, []);

  return (
    <div className="flex w-full h-full min-h-screen ">
      <div className="md:w-2/6 bg-gray-200">
        {conversations.length === 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4 p-4">Messages</h2>
            <span className="p-4 text-xl">There are no conversations</span>
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
