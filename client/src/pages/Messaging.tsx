import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export default function MessagingPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useRef<Socket | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Connect to the server's WebSocket
    socket.current = io('http://localhost:8080');

    // Listen to 'receive_message' event from the server
    socket.current.on('receive_message', (msg: string) => {
      console.log(`Received message: ${msg}`);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket.current) {
      socket.current.emit('send_message', message);
      setMessage('');
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Real Time Messaging</h1>
      <div
        className="bg-white p-8 rounded w-96 mt-8 overflow-y-scroll h-64"
        ref={messagesEndRef}
      >
        <h1 className="text-xl font-bold mb-4">Messages</h1>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx} className="mb-2">
              {msg}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-8 rounded w-96">
        <h1 className="text-xl font-bold mb-4">Send a Message</h1>
        <form onSubmit={handleSendMessage}>
          <div className="mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded focus:border-blue-400 focus:outline-none resize-none"
              placeholder="Type your message..."
            ></textarea>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none shadow"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
