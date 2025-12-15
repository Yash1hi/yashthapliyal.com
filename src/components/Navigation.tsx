
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { analytics } from '@/lib/analytics';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'nerd', href: '/projects' },
    { name: 'performative', href: '/yash1photos' },
    { name: 'contact', href: '/contact' },
    { name: 'blog', href: '/blog' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300 ease-in-out',
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'py-6'
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a 
          href="/" 
          className="font-mono text-xl font-bold"
          onClick={() => analytics.trackNavigation('home')}
        >
          <span className="bg-black text-white px-2 py-1 rounded-md">yash1hi</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href}
                  className="font-mono text-sm hover:text-gray-600 transition-colors"
                  onClick={() => analytics.trackNavigation(item.name)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden font-mono border border-black px-3 py-2 rounded-md hover:bg-black hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-black/30 bg-white/95 backdrop-blur-sm">
          <ul className="container mx-auto px-4 py-4">
            {navItems.map((item) => (
              <li key={item.name} className="py-2 border-b border-gray-200 last:border-b-0">
                <a 
                  href={item.href}
                  className="font-mono text-sm block transition-colors hover:text-gray-600"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    analytics.trackNavigation(item.name);
                  }}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navigation;
