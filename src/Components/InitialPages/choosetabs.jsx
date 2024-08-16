import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle card click
  const handleCardClick = (url) => {
    navigate(url); // Navigate to the specified URL
  };

  // Array of option cards
  const options = [
    {
      id: 1,
      title: 'Individual',
      description: 'Proceed as an individual user.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-user"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M5.5 21h13a2 2 0 0 0 2 -2v-1a7 7 0 0 0 -7 -7h-3a7 7 0 0 0 -7 7v1a2 2 0 0 0 2 2"></path>
        </svg>
      ),
      url: '/ShowIndividuals', // Replace with your actual URL
    },
    {
      id: 2,
      title: 'Company',
      description: 'Proceed as a company user.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-building"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <rect x="4" y="3" width="16" height="18" rx="2"></rect>
          <line x1="8" y1="7" x2="8" y2="7.01"></line>
          <line x1="12" y1="7" x2="12" y2="7.01"></line>
          <line x1="16" y1="7" x2="16" y2="7.01"></line>
          <line x1="8" y1="11" x2="8" y2="11.01"></line>
          <line x1="12" y1="11" x2="12" y2="11.01"></line>
          <line x1="16" y1="11" x2="16" y2="11.01"></line>
        </svg>
      ),
      url: '/ShowCompanies', // Replace with your actual URL
    },
    {
      id: 3,
      title: 'Add Client',
      description: 'Add a new client to the system.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-user-plus"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M17 21v-6m3 3h-6"></path>
          <path d="M5.5 21h7.5"></path>
        </svg>
      ),
      url: '/addclient', // Replace with your actual URL
    },
  ];

  return (
    <section id="welcome" className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl font-bold text-white">
          Welcome to BM Insurance Brokers
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Choose an option to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4 md:px-10">
        {options.map((option) => (
          <div
            key={option.id}
            className="flex flex-col items-center rounded-md border border-neutral-800 bg-neutral-900/50 p-6 text-center shadow-lg cursor-pointer hover:bg-neutral-800 transition"
            onClick={() => handleCardClick(option.url)}
          >
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border"
              style={{
                backgroundImage:
                  'linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)',
                borderColor: 'rgb(93, 79, 240)',
              }}
            >
              {option.icon}
            </div>
            <h3 className="mt-4 text-gray-400 text-lg font-semibold">
              {option.title}
            </h3>
            <p className="my-3 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
              {option.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
