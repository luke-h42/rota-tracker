import axios from "axios";
import toast from "react-hot-toast";

export default function Subscribe() {
  const handleSubscribe = async (plan) => {
    console.log(plan);
    try {
      const response = await axios.post(
        "/api/subscribe/create-checkout-session",
        {
          plan,
        }
      );
      console.log(response);
      if (response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        toast.error("Failed to connect, please try again shortly.");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to create checkout session, please try again shortly."
      );
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="p-8 mb-4 rounded-lg w-full ">
        <div className="flex items-center justify-center text-3xl font-bold text-royal-blue-500 leading-tight md:text-5xl mb-6">
          <h1>Subscribe to RotaTracker</h1>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col justify-center ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out border-2 border-royal-blue-200 hover:border-royal-blue-400">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Plan
              </h3>
              <div className="text-3xl font-bold mb-4">£1.99/month</div>
              <div className="text-gray-600 mb-4">Up to 5 users</div>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>Admins can manage up to 5 users</li>
                <li>Users can view their shifts</li>
                <li>Email support</li>
                <li className="line-through">
                  Click to send email notification to employees
                </li>
                <li className="line-through">Generate monthly reports</li>
              </ul>
              <div
                className="text-center bg-royal-blue-600 text-white py-2 rounded-md hover:bg-royal-blue-700"
                role="button"
                onClick={() => handleSubscribe("basic")}
              >
                Get Started
              </div>
            </div>

            {/* Standard Plan */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out border-2 border-royal-blue-200 hover:border-royal-blue-400">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Standard Plan
              </h3>
              <div className="text-3xl font-bold mb-4">£4.99/month</div>
              <div className="text-gray-600 mb-4">Up to 20 users</div>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>Admins can manage up to 20 users</li>
                <li>Users can view their shifts</li>
                <li>Email support</li>
                <li>Click to send email notification to employees</li>
                <li>Generate monthly reports</li>
              </ul>
              <div
                className="text-center bg-royal-blue-600 text-white py-2 rounded-md hover:bg-royal-blue-700"
                role="button"
                onClick={() => handleSubscribe("standard")}
              >
                Get Started
              </div>
            </div>
            {/* Premium Plan */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out border-2 border-royal-blue-200 hover:border-royal-blue-400">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Premium Plan
              </h3>
              <div className="text-3xl font-bold mb-4">£9.99/month</div>
              <div className="text-gray-600 mb-4">Up to 100 users</div>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>Admins can manage up to 100 users</li>
                <li>Users can view their shifts</li>
                <li>Email support</li>
                <li>Click to send email notification to employees</li>
                <li>Generate monthly reports</li>
              </ul>
              <div
                className="text-center bg-royal-blue-600 text-white py-2 rounded-md hover:bg-royal-blue-700"
                role="button"
                onClick={() => handleSubscribe("premium")}
              >
                Get Started
              </div>
            </div>
            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out border-2 border-royal-blue-200 hover:border-royal-blue-400">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Pro Plan
              </h3>
              <div className="text-3xl font-bold mb-4">£19.99/month</div>
              <div className="text-gray-600 mb-4">Unlimited users</div>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>Admins can manage unlimited users</li>
                <li>Users can view their shifts</li>
                <li>Email support</li>
                <li>Click to send email notification to employees</li>
                <li>Generate monthly reports</li>
              </ul>
              <div
                className="text-center bg-royal-blue-600 text-white py-2 rounded-md hover:bg-royal-blue-700"
                role="button"
                onClick={() => handleSubscribe("pro")}
              >
                Get Started
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
