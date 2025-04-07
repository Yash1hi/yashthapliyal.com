
import React, { useEffect, useRef } from 'react';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  link?: string;
}

interface PortfolioSectionProps {
  title: string;
  id: string;
  items: PortfolioItem[];
}

const PortfolioSection = ({ title, id, items }: PortfolioSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.fade-in-section');
    items.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      items.forEach((item) => {
        observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section id={id} className="py-16 md:py-24" ref={sectionRef}>
      <div className="container px-4 mx-auto">
        <h2 className="section-heading">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="fade-in-section brutalist-card group hover:shadow-md transition-all duration-300"
            >
              {item.imageUrl && (
                <div className="h-48 md:h-56 overflow-hidden border-b border-gray-200 rounded-t-md">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4 md:p-6 transition-all duration-300 group-hover:bg-gray-100">
                <h3 className="font-mono text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm mb-4 text-gray-600">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-sm font-mono border border-gray-300 group-hover:bg-white">
                      {tag}
                    </span>
                  ))}
                </div>
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-gray-700 hover:text-black transition-colors duration-300 inline-flex items-center"
                  >
                    View Project
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
