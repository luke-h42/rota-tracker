import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          navigate("/dashboard");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer on component unmount
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-full text-black mt-[25vh]">
      <div className="bg-white rounded-lg px-8 py-6 max-w-md w-full items-center justify-center">
        <p className="flex items-center justify-center">
          Your subscription was successful
        </p>
        <p className="flex items-center justify-center">
          Redirecting to dashboard in {countdown}...
        </p>
      </div>
    </div>
  );
}
