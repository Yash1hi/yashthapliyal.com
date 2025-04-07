
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
    { name: 'Photography', href: '#photography' },
    { name: 'Software', href: '#software' },
    { name: 'Writing', href: '#writing' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300 ease-in-out',
        isScrolled ? 'bg-white border-b border-black py-3' : 'py-6'
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="#" className="font-mono text-xl font-bold">
          <span className="highlight">Portfolio</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href}
                  className="font-mono text-sm uppercase tracking-wider hover:underline"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden font-mono border border-black px-3 py-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-black bg-white">
          <ul className="container mx-auto px-4 py-4">
            {navItems.map((item) => (
              <li key={item.name} className="py-2 border-b border-gray-200 last:border-b-0">
                <a 
                  href={item.href}
                  className="font-mono text-sm uppercase tracking-wider block"
                  onClick={() => setMobileMenuOpen(false)}
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
