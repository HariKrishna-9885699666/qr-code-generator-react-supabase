import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { COUNTRIES, INTERESTS, GENDERS } from "@/utils/constants";

interface FormInputs {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dob: string;
  occupation: string;
  interests: string[];
  newsletter: boolean;
  country: string;
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      interests: [],
      newsletter: false,
    },
  });

  /**
   * Handles the form submission.
   *
   * Inserts the user into the database, generates a QR code with the user's ID and
   * "scanned" query parameter, updates the user with the QR code URL, and redirects
   * to the home page on success.
   *
   * @param {FormInputs} data The form data.
   * @returns {Promise<void>}
   */
  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    try {
      // First insert the user to get the ID
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            dob: data.dob,
            occupation: data.occupation,
            interests: data.interests,
            newsletter: data.newsletter,
            country: data.country,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (userError) throw userError;

      // Generate QR code with "scanned" query parameter
      const qrCodeUrl = await QRCode.toDataURL(
        `${window.location.origin}/user/${userData.id}?scanned=true`
      );

      // Update user with QR code URL
      const { error: updateError } = await supabase
        .from("users")
        .update({ qr_code_url: qrCodeUrl })
        .eq("id", userData.id);

      if (updateError) throw updateError;

      toast.success("User added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user. Please try again.");
    }
  };

  /**
   * Handles the change event of the interests checkboxes.
   *
   * Updates the "interests" field of the form state with the new set of interests.
   *
   * @param {string} value The value of the checkbox that changed.
   * @param {boolean} checked The checked state of the checkbox.
   */
  const handleInterestsChange = (value: string, checked: boolean) => {
    const currentInterests = watch("interests");
    const newInterests = checked
      ? [...currentInterests, value]
      : currentInterests.filter((interest) => interest !== value);
    setValue("interests", newInterests);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-4 text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
      <h2 className="text-2xl font-bold mb-6">Add New User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+-]+$/,
                  message: "Invalid phone number",
                },
              })}
              type="tel"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters",
                },
              })}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="mt-1 flex space-x-4">
              {GENDERS.map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    {...register("gender", {
                      required: "Please select a gender",
                    })}
                    type="radio"
                    value={gender}
                    className="form-radio"
                  />
                  <span className="ml-2 capitalize">{gender}</span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              {...register("dob", { required: "Date of birth is required" })}
              type="date"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Occupation
            </label>
            <input
              {...register("occupation", {
                required: "Occupation is required",
              })}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.occupation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.occupation.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              {...register("country", { required: "Please select a country" })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Newsletter
            </label>
            <div className="mt-1 flex items-center">
              <input
                {...register("newsletter")}
                type="checkbox"
                className="form-checkbox"
              />
              <span className="ml-2">Subscribe to newsletter</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Interests
          </label>
          <div className="mt-1 flex flex-wrap gap-4">
            {INTERESTS.map((interest) => (
              <label key={interest} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInterestsChange(interest, e.target.checked)
                  }
                  className="form-checkbox"
                />
                <span className="capitalize">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Adding User..." : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
