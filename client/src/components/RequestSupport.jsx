import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RequestSupport({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

  const getSupport = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!supportMessage) {
      toast.error("Please fill in all the fields.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/users/get-support",
        {
          supportMessage,
        },
        {
          withCredentials: true,
        }
      );
      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
      } else {
        setSupportMessage("");
        setIsLoading(false);
        toast.success("Support message sent.");
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Support message failed to send, please try again"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full text-black">
      <div className="px-4 py-6 max-w-full w-full sm:max-w-md max-h-[80vh] overflow-auto">
        <form>
          <div className="mb-2">
            <label htmlFor="support-message" className="flex mb-2 text-left">
              Please describe your problem. We will try to get back to you as
              soon as possible.
            </label>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              id="support-message"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
              placeholder="Type your problem here"
              required
              aria-label="support message"
              rows="4"
              cols="50"
            ></textarea>
          </div>

          <button
            type="button"
            onClick={(e) => {
              getSupport(e);
            }}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-500 hover:bg-royal-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label={
              isLoading ? "Sending support message..." : "Request Support"
            }
          >
            {isLoading ? "Sending support message..." : "Request Support"}
          </button>
        </form>
      </div>
    </div>
  );
}
