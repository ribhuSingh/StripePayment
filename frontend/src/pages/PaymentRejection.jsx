import React from 'react'
import { XCircle } from "lucide-react"; 
const PaymentRejection = () => {
  return (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Error Icon */}
      <XCircle className="w-20 h-20 text-red-600 mb-6" />

      {/* Heading */}
      <h1 className="text-3xl font-bold text-red-700 mb-4">
        Payment Failed ❌
      </h1>

      {/* Sub-text */}
      <p className="text-gray-700 text-center max-w-md mb-8">
        Unfortunately, your payment could not be processed.  
        Please check your card details or try again with a different method.
      </p>

      {/* Retry button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-red-700 transform hover:scale-105 transition duration-200"
      >
        🔄 Try Again
      </button>
    </div>
  )
}

export default PaymentRejection
