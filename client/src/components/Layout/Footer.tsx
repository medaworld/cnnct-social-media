import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-sm">
      <div className="container mx-auto p-8 flex flex-wrap justify-between items-end">
        <div className="flex flex-col items-center md:items-start w-full md:w-auto mb-4 md:mb-0">
          <img src={logo} alt="cnnct logo" className="mb-4 w-24" />
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} cnnct. All rights reserved.
          </p>
        </div>

        <nav className="w-full md:w-auto">
          <ul className="flex flex-wrap justify-center md:justify-end space-x-4">
            <li>
              <Link to="#" className="hover:text-gray-400">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-400">
                Help & Support
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-3 px-4 text-red-700 bg-yellow-100 border border-yellow-300">
        This is a site for demonstration purposes only.
      </div>
    </footer>
  );
}
