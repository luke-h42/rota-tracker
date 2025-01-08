import React from "react";

export default function Subscribe() {
  return (
    <div className="flex flex-col items-center   ">
      <div className=" p-8 mb-4 rounded-lg w-full ">
        <div className="flex items-center justify-center text-3xl font-bold text-royal-blue-500 leading-tight md:text-5xl mb-6">
          <h1>Subscribe to RotaTracker</h1>
        </div>
        <div className="max-w-6xl mx-auto ">
          {/* Manager Section */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Basic Plan
                </h3>
                <p className="text-gray-600 text-lg">5 Users</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Standard Plan
                </h3>
                <p className="text-gray-600 text-lg">20 Users</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Premium Plan
                </h3>
                <p className="text-gray-600 text-lg">100 Users</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Pro Plan
                </h3>
                <p className="text-gray-600 text-lg">Unlimited Users</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
