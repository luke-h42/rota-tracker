import axios from "axios";
import toast from "react-hot-toast";

export default function AdminDeleteShift({
  onClose,
  fetchShifts,
  selectedShift,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.delete(`/api/shifts/shift/${selectedShift}`, {
        data: {
          _id: selectedShift,
        },
      });
      toast.success("Shift deleted successfully!");
      fetchShifts();
      onClose();
    } catch (error) {
      console.error("Error deleting shift:", error);
      toast.error("Failed to delete shift.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full text-black gap-4">
      <p className="place-self-start">
        This is a permanent change and cannot be undone.
      </p>
      <div className="w-full flex justify-between ">
        <button
          className="bg-red-300 text-black px-4 py-2 rounded-md border hover:text-gray-900 hover:bg-gray-300 w-1/4 md:w-auto disabled:bg-gray-500 "
          onClick={handleSubmit}
        >
          Delete
        </button>
        <button
          type="button"
          className="bg-gray-900 text-gray-300 px-4 py-2 rounded-md border hover:text-gray-900 hover:bg-gray-300 w-1/4 md:w-auto disabled:bg-gray-500"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
