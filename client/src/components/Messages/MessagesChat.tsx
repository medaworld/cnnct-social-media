import { useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../../utils/authUtils';
import { FaUser } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Loader from '../Common/Loader';

export default function MessagesChat() {
  const { conversationId } = useParams();
  const [recipient, setRecipient] = useState({
    username: '',
    image: { url: '' },
    _id: '',
  });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socket = useRef<Socket | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    socket.current = io(`${process.env.REACT_APP_API}`);

    socket.current.on('receive_message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.current.on('initial_data', (initialData: any) => {
      setRecipient(initialData.recipient);
      setMessages(initialData.messages);
      setIsLoading(false);
    });

    const token = getAuthToken();

    socket.current.emit('authenticate', token);
    socket.current.emit('join_room', conversationId);
    return () => {
      socket.current?.disconnect();
    };
  }, [conversationId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket.current) {
      socket.current.emit('send_message', conversationId, message);
      setMessage('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div
        className="flex-grow overflow-y-scroll md:p-8 rounded "
        ref={messagesEndRef}
      >
        {recipient.username && (
          <div className="flex flex-col items-center p-4 border-b">
            <Link to={`/${recipient.username}`}>
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mt-10 relative overflow-hidden">
                {recipient.image && recipient.image.url ? (
                  <img
                    src={recipient.image.url}
                    alt={recipient.username}
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <FaUser size={60} />
                )}
              </div>
            </Link>
            <Link to={`/${recipient.username}`}>
              <h2 className="mt-2 text-xl">@{recipient.username}</h2>
            </Link>
          </div>
        )}

        <div className="flex flex-col items-stretch w-full mt-4">
          <ul>
            {messages.map((msg: any, idx) => (
              <li
                key={idx}
                className={`mb-4 flex ${
                  msg.sender !== recipient._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex flex-col items-${
                    msg.sender !== recipient._id ? 'end' : 'start'
                  }`}
                >
                  <div
                    className={`p-4 max-w-1/2 w-fit ${
                      msg.sender !== recipient._id
                        ? 'bg-blue-100 rounded-tr-none rounded-l-3xl text-right'
                        : 'bg-gray-300 rounded-tl-none rounded-r-3xl'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div
                    className={`text-sm text-gray-500 mt-1 ${
                      msg.sender !== recipient._id ? 'text-right' : ''
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full flex-shrink-0 border-t">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center p-1 md:p-5 bg-gray-100"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded focus:border-blue-400 focus:outline-none resize-none"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 ml-2 rounded focus:outline-none shadow"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
}
