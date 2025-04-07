
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-black">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="font-mono text-sm">
            &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="font-mono text-sm hover:underline">
              Instagram
            </a>
            <a href="#" className="font-mono text-sm hover:underline">
              Dribbble
            </a>
            <a href="#" className="font-mono text-sm hover:underline">
              GitHub
            </a>
            <a href="#" className="font-mono text-sm hover:underline">
              LinkedIn
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 text-center md:text-left">
          <p className="text-xs text-gray-500">
            Designed and built with passion and precision.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
