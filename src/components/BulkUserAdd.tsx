import { useState } from "react";
import { faker } from "@faker-js/faker";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { COUNTRIES, INTERESTS, GENDERS } from "@/utils/constants";

const BulkUserAdd = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const addRandomUsers = async () => {
    setLoading(true);
    const userCount = 10;
    try {
      await Promise.all(
        Array.from({ length: userCount }).map(async () => {
          let email = faker.internet.email();
          const emailParts = email.split("@");
          const domain = emailParts[1];
          const localPart = emailParts[0].substring(0, 18 - domain.length - 1);
          email = `${localPart}@${domain}`;

          const user = {
            name: faker.name.fullName(),
            email,
            phone: faker.phone.number('##########'), // 10 digits
            address: faker.address.streetAddress(),
            gender: faker.helpers.arrayElement(GENDERS),
            dob: faker.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString().split('T')[0],
            occupation: faker.name.jobTitle(),
            interests: faker.helpers.arrayElements(INTERESTS, 2),
            newsletter: faker.datatype.boolean(),
            country: faker.helpers.arrayElement(COUNTRIES.map(c => c.value)),
            created_at: new Date().toISOString(),
          };

          const { data: userData, error: userError } = await supabase
            .from("users")
            .insert([user])
            .select()
            .single();

          if (userError) throw userError;

          const qrCodeUrl = await QRCode.toDataURL(
            `${window.location.origin}/user/${userData.id}?scanned=true`
          );

          const { error: updateError } = await supabase
            .from("users")
            .update({ qr_code_url: qrCodeUrl })
            .eq("id", userData.id);

          if (updateError) throw updateError;

          return userData;
        })
      );

      toast.success(`${userCount} Random users added successfully!`);
    } catch (error) {
      console.error("Error adding random users:", error);
      toast.error("Error adding random users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Bulk User Add</h2>
      <button
        onClick={addRandomUsers}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Adding Users..." : "Add Random Users"}
      </button>
    </div>
  );
};

export default BulkUserAdd;
