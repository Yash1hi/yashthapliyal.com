
import React, { useEffect, useState } from 'react';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const roles = ['Software Developer', 'Cyber Security Specialist', 'Photographer', 'Designer'];
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16 noise-bg">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className={`transition-all duration-700 delay-300 ${loaded ? 'opacity-100' : 'opacity-0 -translate-y-8'}`}>
            <h1 className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
              Yash<br />Thapliyal
            </h1>
            <div className="h-16 mt-6">
              <p className="font-mono text-xl md:text-2xl">
                I am a <span className="highlight inline-block">{roles[currentRole]}</span>
              </p>
            </div>
            <p className="mt-8 max-w-lg text-lg text-gray-700">
              Creating at the intersection of technology and art. Building software solutions, 
              ensuring digital security, capturing moments through photography, and designing 
              experiences that matter.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#contact" className="brutalist-button">Get in Touch</a>
              <a href="#portfolio" className="brutalist-button">View My Work</a>
            </div>
          </div>
          
          <div className={`grid grid-cols-2 gap-2 md:gap-4 transition-all duration-700 delay-500 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            <div className="h-40 md:h-64 bg-gray-800 rounded-lg"></div>
            <div className="h-64 md:h-80 border border-gray-400 bg-gray-100 rounded-lg"></div>
            <div className="h-64 md:h-80 col-span-2 border border-gray-400 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="font-mono text-gray-700">Making, breaking, and everything in between.</p>
            </div>
          </div>
        </div>

        <div className={`mt-20 md:mt-32 text-center transition-all duration-700 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <a href="#portfolio" className="inline-block animate-bounce">
            <div className="border border-gray-400 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
