const ModuleCheckIn = ({ onSave, onClose }: { onSave: () => void; onClose: () => void }) => {
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold mb-2">Check-in</h3>
      <p className="text-sm text-gray-600 mb-4">How are you feeling right now?</p>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ModuleCheckIn;
