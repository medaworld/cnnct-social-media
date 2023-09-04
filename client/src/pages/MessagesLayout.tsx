import { Outlet } from 'react-router-dom';
import MessageList from '../components/Messages/MessagesList';

export default function MessagesLayout() {
  return (
    <div className="flex w-full h-full min-h-screen ">
      <div className="w-2/6 overflow-y-scroll bg-gray-200">
        <MessageList />
      </div>
      <div className="w-4/6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
