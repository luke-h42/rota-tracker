import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useTrialCheck = () => {
  const { user } = useContext(UserContext);
  const [bannerMessage, setBannerMessage] = useState("");
  const [accessBlocked, setAccessBlocked] = useState(false);
  const navigate = useNavigate();

  // Function to check trial status and subscription status
  const checkTrialStatus = (user) => {
    const currentDate = new Date();
    const trialEndDate = new Date(user.trialEndDate); // Convert string to Date

    if (user.subscriptionPlan === "trial") {
      if (currentDate < trialEndDate) {
        // Trial is still active
        const daysLeft = Math.ceil(
          (trialEndDate - currentDate) / (1000 * 60 * 60 * 24)
        ); // Calculate days left
        setBannerMessage(`Your trial ends in ${daysLeft} day(s).`);
        setAccessBlocked(false);
      } else {
        // Trial has expired
        setBannerMessage(
          "Your trial has expired. Please subscribe to continue using the app."
        );
        setAccessBlocked(true);
      }
    } else if (user.subscriptionStatus === "inactive") {
      // Subscription is inactive, block access
      setBannerMessage(
        "Your subscription is inactive. Please renew to continue using the app."
      );
      setAccessBlocked(true);
    } else if (user.subscriptionStatus === "past_due") {
      // Subscription is overdue, block access
      setBannerMessage(
        "Your subscription payment has failed. Please renew to continue using the app."
      );
      setAccessBlocked(true);
    } else {
      // User has an active subscription
      setBannerMessage("");
      setAccessBlocked(false);
    }
  };

  // Check trial status and subscription status on component mount or when user changes
  useEffect(() => {
    if (user) {
      checkTrialStatus(user);
    }
  }, [user]);

  // Redirect to subscribe page if access is blocked
  useEffect(() => {
    if (accessBlocked) {
      if (user.subscriptionStatus === "inactive") {
        toast(
          "Your subscription is inactive. Please subscribe to continue using our services."
        );
      } else if (user.subscriptionStatus === "past_due") {
        toast(
          "Your subscription payment methodd has failed. Please re-subscribe to continue using our services."
        );
      } else {
        toast(
          "Your trial has ended. Please subscribe to continue using our services."
        );
      }
      navigate("/subscribe");
    }
  }, [accessBlocked, navigate]);

  return { bannerMessage, accessBlocked };
};

export default useTrialCheck;
