import React, { useState } from "react";

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    amount: "",
    phone: "",
    orderId: "",
    productId: "",
    externalUserId: "",
    url: "", 
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-6">
          <h1 className="text-3xl font-extrabold">Welcome to Payment Gateway</h1>
          <p className="mt-2 text-sm text-gray-200">
            Secure and fast Stripe Checkout
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Stripe Payment Form
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Address", name: "address", type: "text" },
              { label: "Amount", name: "amount", type: "number" },
              { label: "Phone No.", name: "phone", type: "text" },
              { label: "Order ID", name: "orderId", type: "text" },
              { label: "Product ID", name: "productId", type: "text" },
               { label: "Project Url", name: "url", type: "text" },
              {
                label: "External User ID",
                name: "externalUserId",
                type: "text",
              },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            ))}
          </div>

          {/* Checkout Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-md"
          >
            Proceed to Checkout
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
