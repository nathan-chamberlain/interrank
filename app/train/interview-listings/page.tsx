import React from 'react';
import { User } from 'lucide-react';

const InterviewListingsUI = () => {
  const companies = [
    {
      id: 'general',
      name: 'General Questions',
      description: 'Common interview questions that apply across industries and roles.',
      logo: '?',
      isGeneral: true
    },
    {
      id: 'sendd',
      name: 'Sendd',
      description: 'A leading logistics and delivery platform revolutionizing last-mile solutions.',
      logo: '/Sendd-logo.png',
      isGeneral: false
    },
    {
      id: 'rintr',
      name: 'Rintr',
      description: 'An innovative rental marketplace connecting people with quality rental solutions.',
      logo: '/logo-blue.png',
      isGeneral: false
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#131614' }}>
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
          {companies.map((company) => (
            <div key={company.id} className="flex flex-col items-start group">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                {/* Original Content */}
                <button
                  className={`w-full h-full transition-all duration-300 flex items-center justify-center font-medium ${
                    company.isGeneral 
                      ? 'bg-green-700 text-white text-5xl group-hover:opacity-0' 
                      : 'bg-white group-hover:opacity-0'
                  }`}
                  aria-label={`${company.name} interview questions`}
                >
                  {company.isGeneral ? (
                    company.logo
                  ) : (
                    <img 
                      src={company.logo} 
                      alt={`${company.name} Logo`} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-200 mb-4 leading-relaxed">
                    {company.description}
                  </p>
                  <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <span className="text-base text-gray-300 mt-2 font-medium">
                  {company.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewListingsUI;