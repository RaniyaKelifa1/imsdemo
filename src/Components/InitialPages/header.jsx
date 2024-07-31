import React from 'react';

function Header() {
  return (
   
    <section
        id="features"
        className="relative block px-6 py-1  md:px-10 border-t border-b"
      >
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-gray-400 my-3 flex items-center justify-center font-medium uppercase tracking-wider">
           Insurance Managment System
          </span>
          <h2 className="block w-full bg-gradient-to-b from-white to-gray-400 bg-clip-text font-bold text-transparent text-3xl sm:text-4xl">
            Bizuhan & Mebratu Insurance Brokers GP.
          </h2>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400">
           Motor Insurances
          </p>
        </div>
    </section>
 

);
}

export default Header;
