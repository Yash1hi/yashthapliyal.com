
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-300 rounded-t-lg bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="font-mono text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Yash Thapliyal. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="font-mono text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Instagram
            </a>
            <a href="#" className="font-mono text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Dribbble
            </a>
            <a href="#" className="font-mono text-sm text-gray-600 hover:text-gray-900 transition-colors">
              GitHub
            </a>
            <a href="#" className="font-mono text-sm text-gray-600 hover:text-gray-900 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-center font-mono text-gray-500">
            Making, breaking, and everything in between.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
