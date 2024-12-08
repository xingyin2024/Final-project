import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
  const { user, login } = useContext(AuthContext); // Mock login to update user details
  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    secondname: user?.secondname || "",    
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // Simulate updating user details (In real implementation, call backend API here)
    login({ ...user, ...formData });
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-600">Firstname</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            disabled={!isEditing}
            onChange={handleChange}
            className={`border rounded-md w-full p-2 ${isEditing ? "border-gray-400" : "bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">Secondname</label>
          <input
            type="text"
            name="secondname"
            value={formData.secondname}
            disabled={!isEditing}
            onChange={handleChange}
            className={`border rounded-md w-full p-2 ${isEditing ? "border-gray-400" : "bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled={!isEditing}
            onChange={handleChange}
            className={`border rounded-md w-full p-2 ${isEditing ? "border-gray-400" : "bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            disabled={!isEditing}
            onChange={handleChange}
            className={`border rounded-md w-full p-2 ${isEditing ? "border-gray-400" : "bg-gray-100"}`}
          />
        </div>
        <div className="mt-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded-md"
            >
              Edit Profile
            </button>
          )}
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
