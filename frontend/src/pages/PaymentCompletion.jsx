import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const PaymentCompletion = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000); // 🎉 Confetti for 5s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-50 px-4 relative overflow-hidden">
      {/* 🎉 Confetti */}
      {showConfetti && <Confetti numberOfPieces={250} recycle={false} />}

      {/* ✅ Success tick animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="w-28 h-28 rounded-full bg-green-600 flex items-center justify-center shadow-lg"
      >
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-5xl"
        >
          ✅
        </motion.span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-bold text-green-700 mt-6 mb-2"
      >
        Payment Successful!
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-gray-600 mb-6"
      >
        Your transaction was completed securely 🎉
      </motion.p>

      {/* Button with hover animation */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        🔄 Back to Checkout
      </motion.button>
    </div>
  );
};

export default PaymentCompletion;
