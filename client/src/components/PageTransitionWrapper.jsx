// src/components/PageTransitionWrapper.js
import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

// This wrapper will animate the route change with a fade-in effect
const PageTransitionWrapper = ({ children }) => {
  const location = useLocation(); // Access the current location

  return (
    <motion.div
      key={location.pathname} // Trigger the animation based on the pathname
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransitionWrapper;
