
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import PortfolioSection from '@/components/PortfolioSection';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  // Sample data for portfolio sections
  const photographyProjects = [
    {
      id: 1,
      title: "Urban Minimalism",
      description: "A series exploring the clean lines and stark contrasts of urban architecture.",
      tags: ["Black & White", "Architecture", "Minimalism"],
      imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Light & Shadow",
      description: "Capturing the interplay between natural light and structural elements.",
      tags: ["Contrast", "Composition", "Lighting"],
      imageUrl: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Abstract Reflections",
      description: "Exploring reflective surfaces and abstract forms in modern architecture.",
      tags: ["Abstract", "Reflection", "Urban"],
      imageUrl: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80",
    }
  ];

  const softwareProjects = [
    {
      id: 1,
      title: "Secure Authentication System",
      description: "A robust authentication system with multi-factor authentication built using React and Node.js.",
      tags: ["React", "Node.js", "Security"],
      link: "#",
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with secure payment processing and inventory management.",
      tags: ["TypeScript", "Express", "PostgreSQL"],
      link: "#",
    },
    {
      id: 3,
      title: "Real-time Analytics Dashboard",
      description: "Interactive dashboard for monitoring system metrics and user behavior in real-time.",
      tags: ["Data Visualization", "WebSockets", "React"],
      link: "#",
    }
  ];

  const writingProjects = [
    {
      id: 1,
      title: "The Intersection of Design and Security",
      description: "An article exploring how good design principles can enhance digital security.",
      tags: ["Design", "Security", "UX"],
      link: "#",
    },
    {
      id: 2,
      title: "Photography Techniques for Developers",
      description: "How photography principles can improve your approach to software development.",
      tags: ["Photography", "Development", "Creativity"],
      link: "#",
    },
    {
      id: 3,
      title: "Building Secure and Beautiful Applications",
      description: "A guide to balancing security requirements with aesthetic design principles.",
      tags: ["Security", "UI/UX", "Development"],
      link: "#",
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.fade-in-section');
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

      sections.forEach((section) => {
        observer.observe(section);
      });

      return () => {
        sections.forEach((section) => {
          observer.unobserve(section);
        });
      };
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      <div id="portfolio" className="bg-white">
        <PortfolioSection 
          title="Photography" 
          id="photography" 
          items={photographyProjects} 
        />
        
        <div className="bg-[#f9f9f9]">
          <PortfolioSection 
            title="Software" 
            id="software" 
            items={softwareProjects} 
          />
        </div>
        
        <PortfolioSection 
          title="Writing" 
          id="writing" 
          items={writingProjects} 
        />
      </div>
      
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
