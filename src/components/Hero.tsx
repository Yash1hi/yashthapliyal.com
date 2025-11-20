
import React, { useEffect, useState } from 'react';
import HeroMusicDisplay from '@/components/HeroMusicDisplay';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const roles = ['Software Developer', 'Hacker', 'Photographer', 'Designer', 'Scholar'];
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className={`font-mono text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Yash<br />Thapliyal
            </h1>
            <div className={`h-16 mt-6 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="font-mono text-xl md:text-2xl">
                I am a <span className="highlight inline-block">{roles[currentRole]}</span>
              </p>
            </div>
            <p className={`mt-8 max-w-lg text-lg text-gray-700 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Creating at the intersection of technology and art. Building software solutions,
              enhancing digital security, capturing moments through photography, designing
              next generation products, and learning throughout the process.
            </p>
            <div className={`mt-8 flex flex-wrap gap-4 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a href="#contact" className="brutalist-button">Get in Touch</a>
              <a href="#portfolio" className="brutalist-button">View My Work</a>
            </div>
          </div>

          <div>
            <div className={`flex justify-center mb-6 transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gray-300 bg-gray-100 flex items-center justify-center">
                {/* <div className="text-gray-400 font-mono">Your Photo</div>
                <div className="absolute inset-0 bg-gray-200 opacity-20"></div> */}
                <img src="/headshot.jpeg" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Music Display */}
            <div className={`max-w-md mx-auto transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <HeroMusicDisplay />
            </div>
          </div>
        </div>

        <div className={`mt-20 md:mt-32 text-center transition-all duration-700 delay-600 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
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
