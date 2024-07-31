import React, { useEffect } from 'react';
import lottie from 'lottie-web';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Welcome = () => {
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.querySelector("#lottie-animation"), // the DOM element
      renderer: 'svg', // renderer type
      loop: true, // loop the animation
      autoplay: true, // start playing automatically
      path: 'https://lottie.host/2deb687d-ad47-42ad-8554-02356349cefe/0pkBI9MMKD.json' // the path to the animation data
    });

    return () => {
      animation.destroy(); // clean up the animation on component unmount
    };
  }, []);

  return (
    <section className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center max-w-6xl px-6 py-8 mx-auto">
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
            Welcome to <br />
            <span className="text-blue-500">BM Insurance Brokers</span>
            <br />
            Motor Insurance Section
          </h1>
        
          <div className="mt-8 flex justify-center md:justify-start">
            <button
              onClick={() => navigate('/choosetask')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-lg">Get Started</span>
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <div id="lottie-animation" className="w-full max-w-sm h-auto"></div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
