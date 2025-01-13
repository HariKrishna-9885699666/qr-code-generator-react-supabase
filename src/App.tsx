import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserForm from './components/UserForm';
import BulkUserAdd from './components/BulkUserAdd';
import Navigation from './components/Navigation';

/**
 * The main application component.
 *
 * This component renders the main application layout, which consists of:
 *
 * - A Navigation component at the top of the page.
 * - A container element with a Toaster component.
 * - A Routes component that renders the correct route based on the current URL.
 *
 * The Routes component renders the following routes:
 *
 * - A UserList component at the root URL.
 * - A UserForm component at the "/add" URL.
 * - A UserDetail component at URLs of the form "/user/:id".
 * - A BulkUserAdd component at the "/bulk-add" URL.
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/add" element={<UserForm />} />
            <Route path="/user/:id" element={<UserDetail />} />
            <Route path="/bulk-add" element={<BulkUserAdd />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;