import React, { useState } from "react";

interface BioSectionProps {
  initialBio: string;
  onBioChange: (bio: string) => void;
}

export const BioSection = ({ initialBio, onBioChange }: BioSectionProps) => {
  const [bio, setBio] = useState(initialBio);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
    onBioChange(e.target.value);
  };

  return (
    <div className="mt-6">
      <label className="text-lg font-semibold" htmlFor="bio">
        Bio
      </label>
      <textarea
        id="bio"
        value={bio}
        onChange={handleBioChange}
        className="mt-2 w-full border rounded p-2"
        rows={4}
      />
    </div>
  );
};
