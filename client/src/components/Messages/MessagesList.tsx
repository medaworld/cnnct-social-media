import { Link } from 'react-router-dom';

export default function MessageList() {
  const messages = [{ id: 'aa', content: 'Hello' }];

  return (
    <div>
      {messages.map((message) => (
        <Link key={message.id} to={`/messages/${message.id}`}>
          {message.content}
        </Link>
      ))}
    </div>
  );
}
