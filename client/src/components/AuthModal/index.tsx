import Modal from 'react-modal';
import SignUpForm from './SignUpForm';
import { FaTimes } from 'react-icons/fa';

Modal.setAppElement('#root');

function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Sign Up Modal"
      closeTimeoutMS={200}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        },
      }}
    >
      <button
        onClick={onClose}
        type="button"
        className="absolute top-2 right-2 text-xl font-bold focus:outline-none hover:bg-gray-300 p-1 rounded-full transition duration-200"
      >
        <FaTimes />
      </button>
      <SignUpForm />
    </Modal>
  );
}

export default AuthModal;
