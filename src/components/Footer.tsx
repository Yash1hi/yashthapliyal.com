
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-black/50 rounded-t-lg">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="font-mono text-sm">
            &copy; {new Date().getFullYear()} Yash Thapliyal. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="font-mono text-sm hover:text-gray-600 transition-colors">
              Instagram
            </a>
            <a href="#" className="font-mono text-sm hover:text-gray-600 transition-colors">
              Dribbble
            </a>
            <a href="#" className="font-mono text-sm hover:text-gray-600 transition-colors">
              GitHub
            </a>
            <a href="#" className="font-mono text-sm hover:text-gray-600 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 text-center md:text-left">
          <p className="text-xs text-gray-500">
            Making, breaking, and everything in between.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
