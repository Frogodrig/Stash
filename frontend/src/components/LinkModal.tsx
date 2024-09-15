import React, { useState } from "react";

interface LinkInputProps {
  onSubmit: (url: string) => void;
  onCancel: () => void;
}

const LinkInput: React.FC<LinkInputProps> = ({ onSubmit, onCancel }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if (url) {
      onSubmit(url);
      setUrl(""); // Clear input
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter link URL"
        className="border rounded p-1"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-2 rounded"
      >
        Insert
      </button>
      <button onClick={onCancel} className="text-gray-500">
        Cancel
      </button>
    </div>
  );
};

export default LinkInput;
