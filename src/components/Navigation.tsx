import { Link } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-gray-900">
            <Users className="w-6 h-6" />
            <span className="font-semibold">User QR System</span>
          </Link>
          <Link
            to="/add"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;