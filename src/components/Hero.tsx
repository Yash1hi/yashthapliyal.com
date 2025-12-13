
import React, { useEffect, useState } from 'react';

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
    <section className="relative min-h-screen flex items-center justify-center noise-bg">
      <div className="container px-4 mx-auto text-center">
        <h1 className={`font-mono text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Yash Thapliyal
        </h1>
        <div className={`mt-6 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-mono text-xl md:text-2xl">
            I am a <span className="highlight inline-block">{roles[currentRole]}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
