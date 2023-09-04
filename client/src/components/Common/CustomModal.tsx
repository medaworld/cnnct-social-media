import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { ReactNode, useEffect, useState } from 'react';

Modal.setAppElement('#root');

export default function CustomModal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
          minWidth: windowWidth <= 640 ? '90%' : '500px',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '25px',
          paddingTop: '40px',
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
      {children}
    </Modal>
  );
}
