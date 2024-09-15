import { useProfile } from "../hooks";
import { ProfileCard } from "../components/ProfileCard";
import { BioSection } from "../components/BioSection";
import { ActionButtons } from "../components/ActionButtons";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { updateUserInput } from "@stonksblog/stonksblog-common";
import axios from "axios";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import { Appbar } from "../components/Appbar";
import toast from "react-hot-toast";

export const Profile = () => {
  const navigate = useNavigate();
  const { loading, profile } = useProfile();
  const [profileInputs, setProfileInputs] = useState<updateUserInput>({
    bio: profile?.bio,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (loading) {
    return (
      <div>
        <Appbar profile={null} />
        <ProfileSkeleton />
      </div>
    );
  }

  async function sendRequest() {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/user/profile/view`,
        profileInputs,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const message = response.data.message || "Profile updated successfully!";
      toast.success(message);
      navigate("/blogs");
    } catch (e) {
      toast.error("Current password may be incorrect");
      console.log(e);
    }
  }

  const handleBioChange = (bio: string) => {
    setProfileInputs((profileInputs) => ({ ...profileInputs, bio }));
  };

  const handleCancel = () => {
    // Navigate user back to blogs
    navigate("/blogs");
  };

  const handleSave = () => {
    // Validate passwords
    if (
      profileInputs.newPassword &&
      profileInputs.currentPassword &&
      profileInputs.confirmPassword &&
      profileInputs.newPassword !== profileInputs.confirmPassword
    ) {
      toast.error("Passwords do not match.");
      return;
    }

    sendRequest();
  };

  return (
    <div>
      <Appbar profile={profile} />
      <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded shadow">
        <ProfileCard
          name={profile?.name || "User"}
          email={profile?.email || "Email not found"}
        />
        <BioSection
          initialBio={profile?.bio || "New member"}
          onBioChange={handleBioChange}
        />
        {/* Password Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <LabelledInput
            label="Current Password"
            type={"password"}
            placeholder="old password"
            onChange={(e) => {
              setProfileInputs((profileInputs) => ({
                ...profileInputs,
                currentPassword: e.target.value,
              }));
            }}
          />
          <LabelledInput
            label="New Password"
            type={"password"}
            placeholder="new password"
            onChange={(e) => {
              setProfileInputs((profileInputs) => ({
                ...profileInputs,
                newPassword: e.target.value,
              }));
            }}
          />
          <LabelledInput
            label="Confirm Password"
            type={"password"}
            placeholder="confirm password"
            onChange={(e) => {
              setProfileInputs((profileInputs) => ({
                ...profileInputs,
                confirmPassword: e.target.value,
              }));
            }}
          />
        </div>
        <ActionButtons onCancel={handleCancel} onSave={handleSave} />
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({
  label,
  placeholder,
  type,
  onChange,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-black mt-4">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default Profile;
