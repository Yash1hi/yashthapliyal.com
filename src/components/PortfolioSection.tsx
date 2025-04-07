
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
              className="fade-in-section brutalist-card group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {item.imageUrl && (
                <div className="h-48 md:h-56 overflow-hidden border-b border-black">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-4 md:p-6">
                <h3 className="font-mono text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="text-xs border border-black px-2 py-1 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-sm underline hover:no-underline"
                  >
                    View Project →
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
