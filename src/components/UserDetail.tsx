import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Globe,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import loaderImage from "@/assets/loader.gif";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  qr_code_url: string;
  gender: string;
  dob: string;
  occupation: string;
  interests: string[];
  newsletter: boolean;
  country: string;
  created_at: string;
  updated_at: string;
  no_of_times_scanned: number;
}

/**
 * UserDetail component fetches and displays the details of a specific user.
 *
 * This component retrieves the user's details from the database based on the ID
 * extracted from the URL parameters. It also updates and displays the number of times
 * the user's QR code has been scanned if accessed through a scanned link.
 * 
 * It handles loading and error states. The component displays user information including name, email, phone,
 * address, occupation, date of birth, country, newsletter subscription status, and 
 * a QR code if available.
 *
 * @returns A JSX element that renders the user's details or an error/loading state.
 */

const UserDetail = () => {
  const { id: rawId } = useParams<{ id: string }>();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const scanned = urlParams.get("scanned");
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isScanned, setIsScanned] = useState<boolean>(false);

  const id = rawId?.split("&")[0]; // Extract the UUID part of the id

  useEffect(() => {
    async function fetchUser() {
      if (!id) return;

      try {
        const { data, error }: { data: User | null; error: any } =
          await supabase.from("users").select("*").eq("id", id).single();

        if (!data) {
          setError("User not found");
          return;
        }
        setUser(data);
        if (error) throw error;

        if (scanned === "true" && !isScanned) {
          // Update the no_of_times_scanned field
          await supabase
            .from("users")
            .update({ no_of_times_scanned: data.no_of_times_scanned + 1 })
            .eq("id", id);

          setIsScanned(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id, scanned, isScanned]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <img src={loaderImage} alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    toast.error("User not found");
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 mb-4 text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center flex-wrap sm:flex-nowrap">
          {user.name}
          <span className="ml-2 text-sm text-green-500 whitespace-nowrap">
            ({user.no_of_times_scanned} scans)
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">{user.email}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">{user.phone}</span>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">{user.address}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">{user.occupation}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">{user.dob}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">{user.country}</span>
        </div>
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">
            {user.newsletter ? "Subscribed" : "Not Subscribed"}
          </span>
        </div>
      </div>

      {user.qr_code_url && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">QR Code</h3>
          <img
            src={user.qr_code_url.replace("?scanned=true", "")}
            alt={`QR Code for ${user.name}`}
            className="mx-auto w-48 h-48"
          />
        </div>
      )}
    </div>
  );
};

export default UserDetail;
