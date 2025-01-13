import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Search, Filter, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import loaderImage from "@/assets/loader.gif";
import { COUNTRIES } from "@/utils/constants";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  qr_code_url: string;
  created_at: string;
  updated_at: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
  /**
   * Fetches all users from the database and updates the component state.
   *
   * The function also handles errors and sets the loading state to false once
   * the data is fetched.
   */
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Search and filter functionality
  const filteredUsers = users.filter((user) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue) ||
      user.phone.toLowerCase().includes(searchValue);

    const matchesCountry = selectedCountry
      ? user.country === selectedCountry
      : true;

    return matchesSearch && matchesCountry;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6 px-2 sm:px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl sm:text-2xl font-bold">User List</h2>
        <div className="flex flex-col w-full sm:flex-row sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to="/bulk-add"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <UserPlus className="w-5 h-5" />
            <span>Bulk User Add</span>
          </Link>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                &#x2715;
              </button>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowCountryFilter(!showCountryFilter)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
            {showCountryFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.value}
                    onClick={() => {
                      setSelectedCountry(country.value);
                      setShowCountryFilter(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedCountry === country.value ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    {country.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedCountry && (
            <button
              onClick={() => setSelectedCountry("")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <img src={loaderImage} alt="Loading..." />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
            {currentUsers.map((user) => (
              <Link
              to={`/user/${user.id}`}
              key={user.id}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center truncate">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" /> {user.phone}
                </p>
                </div>
              </div>
              {user.qr_code_url && (
                <div className="mt-4">
                <img
                  src={user.qr_code_url}
                  alt={`QR Code for ${user.name}`}
                  className="mx-auto w-24 h-24 sm:w-32 sm:h-32"
                />
                <p className="text-center text-sm text-gray-500 mt-2">Scan me</p>
                </div>
              )}
              </Link>
            ))}
            </div>
          {filteredUsers.length === 0 && (
            <div className="text-center text-gray-500">
              No users found.
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white text-sm sm:text-base"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 sm:px-4 py-2 border rounded-md text-sm sm:text-base ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white text-sm sm:text-base"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
