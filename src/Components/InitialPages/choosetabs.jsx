import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle card click
  const handleCardClick = (url) => {
    navigate(url); // Navigate to the specified URL
  };

  // Array of feature cards
  const features = [
    {
      id: 1,
      title: 'View Company',
      description: 'Review and manage company details.',
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
      url: '/companylist',
    },
    {
      id: 2,
      title: 'View Users',
      description: 'Manage and review all users within your system.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-users"
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
          <circle cx="17" cy="7" r="4"></circle>
          <path d="M5 20c0 -2.5 2 -4.5 4.5 -4.5h9c2.5 0 4.5 2 4.5 4.5"></path>
        </svg>
      ),
      url: '/viewusers',
    },
    {
      id: 3,
      title: 'View Vehicles',
      description: 'Manage and view vehicle information.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-car"
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
          <path d="M3 10l1 -2h4l1 2h8l1 -2h4l1 2v7a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-7z"></path>
          <circle cx="7" cy="17" r="2"></circle>
          <circle cx="17" cy="17" r="2"></circle>
        </svg>
      ),
      url: '/viewvehicles',
    },
    {
      id: 4,
      title: 'View Policy',
      description: 'Access and manage insurance policies.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-file-text"
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
          <path d="M14 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-12l6 -6"></path>
          <line x1="14" y1="7" x2="14" y2="13"></line>
          <line x1="14" y1="17" x2="14" y2="17.01"></line>
        </svg>
      ),
      url: '/viewpolicy',
    },
    {
      id: 5,
      title: 'View Claim',
      description: 'Track and manage insurance claims.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-clipboard-list"
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
          <rect x="4" y="4" width="16" height="16" rx="2"></rect>
          <line x1="8" y1="8" x2="16" y2="8"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
          <line x1="8" y1="16" x2="16" y2="16"></line>
        </svg>
      ),
      url: '/viewclaims',
    },
  ];

  return (
    <section id="features" className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl font-bold text-white">
          Welcome to BM Insurance Brokers: Motor Insurance Page
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Click on a feature to navigate to the corresponding section.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4 md:px-10">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col items-center rounded-md border border-neutral-800 bg-neutral-900/50 p-6 text-center shadow-lg cursor-pointer hover:bg-neutral-800 transition"
            onClick={() => handleCardClick(feature.url)}
          >
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border"
              style={{
                backgroundImage:
                  'linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)',
                borderColor: 'rgb(93, 79, 240)',
              }}
            >
              {feature.icon}
            </div>
            <h3 className="mt-4 text-gray-400 text-lg font-semibold">
              {feature.title}
            </h3>
            <p className="my-3 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
