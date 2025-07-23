
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import PortfolioSection from '@/components/PortfolioSection';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  // Sample data for portfolio sections

  const softwareProjects = [
    {
      id: 1,
      title: "Trail of Bits Resource Page",
      description: "A fully responsive, auto-updating, cross-app, resource page for Trail of Bits; built with no frameworks.",
      tags: ["Javascript", "HTML", "CSS"],
      link: "https://www.trailofbits.com/opensource/",
    },
    {
      id: 2,
      title: "Logical Proof Generator",
      description: "Tooling that generates entire proofs using A* search, including all intermediate steps. Constructed new grammar within Scala for scalability.",
      tags: ["Scala"],
      link: "https://github.com/Yash1hi/Proof-Generator-3434",
    },
    {
      id: 3,
      title: "Full Stack Medication Management System",
      description: "Full stack web application for medication trackking and management; integrated with medication dispenser.",
      tags: ["NodeJS", "React", "Twilio", "PostgreSQL", "Arduino"],
      link: "https://www.linkedin.com/posts/suctuk_i-was-fortunate-to-participate-in-the-t9hacks-ugcPost-7298820077385039872-Lhxf",
    },  
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
        <div className="bg-[#f9f9f9]">
          <PortfolioSection 
            title="Software" 
            id="software" 
            items={softwareProjects} 
          />
        </div>
        


        {/* <PortfolioSection 
          title="Writing" 
          id="writing" 
          items={writingProjects} 
        /> */}
      </div>
      
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
