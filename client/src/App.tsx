import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to the server's WebSocket
    socket.current = io('http://localhost:8080');

    // Listen to 'receive_message' event from the server
    socket.current.on('receive_message', (msg: string) => {
      console.log(`Received message: ${msg}`);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

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
      <div className="bg-white p-8 rounded shadow-md w-96">
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

export default App;
