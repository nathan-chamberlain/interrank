import React from 'react';
import { User } from 'lucide-react';

const InterviewListingsUI = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#131614' }}>
      {/* Top Navigation */}
      <nav className="border-b border-gray-800 bg-[#131614]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="text-xl font-medium text-white">
              InterviewPrep
            </div>

            {/* Navigation & Profile */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-300 hover:text-white transition-colors">
                Home
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm text-gray-300">
                  John Doe
                </span>
                <div
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                  aria-label="User profile"
                >
                  <User size={16} className="text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-8">
          Interview Listings
        </h1>

        {/* Divider */}
        <div className="w-full h-0.5 bg-gray-700 mb-8" />

        {/* Company Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl">
          {/* General Questions */}
          <div className="flex flex-col items-start">
            <button
              className="w-full aspect-square rounded-xl transition-all duration-200 flex items-center justify-center font-medium shadow-md hover:shadow-lg bg-green-700 text-white hover:bg-green-600 text-5xl"
              aria-label="General interview questions"
            >
              ?
            </button>
            <div className="w-full flex justify-center">
              General Questions
            </div>
          </div>

          {/* Sendd */}
          <div className="flex flex-col items-start">
            <button
              className="w-full aspect-square rounded-xl transition-all duration-200 flex items-center justify-center font-medium shadow-md hover:shadow-lg overflow-hidden bg-white hover:bg-gray-100"
              aria-label="Sendd interview questions"
            >
              <img 
                src="/Sendd-logo.png" 
                alt="Sendd Logo" 
                className="w-full h-full object-cover"
              />
            </button>
            <div className="w-full flex justify-center">
              <span className="text-base text-gray-300 mt-2 font-medium">
                Sendd
              </span>
            </div>
          </div>

          {/* Rintr */}
          <div className="flex flex-col items-start">
            <button
              className="w-full aspect-square rounded-xl transition-all duration-200 flex items-center justify-center font-medium shadow-md hover:shadow-lg overflow-hidden bg-white hover:bg-gray-100"
              aria-label="Rintr interview questions"
            >
              <img 
                src="/logo-blue.png" 
                alt="Rintr Logo" 
                className="w-full h-full object-cover"
              />
            </button>
            <div className="w-full flex justify-center">
              Rintr
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewListingsUI;
