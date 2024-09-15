interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
}

export const ActionButtons = ({ onCancel, onSave }: ActionButtonsProps) => {
  return (
    <div className="flex justify-end mt-6">
      <button
        className="bg-slate-500 hover:bg-slate-800 text-white py-2 px-4 rounded mr-4"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className="text-white py-2 px-4 rounded bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300"
        onClick={onSave}
      >
        Save Changes
      </button>
    </div>
  );
};
