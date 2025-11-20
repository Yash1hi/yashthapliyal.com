
import React, { useEffect, useRef, useState } from 'react';
import { 
  Code, Camera, Wrench, Globe, Shield, Terminal, Server, Database, Figma, 
  Image, FileText, Briefcase, CheckCircle, Network, Eye, Workflow
} from 'lucide-react';

interface SkillGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  skills: string[];
}

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const skillGroups: SkillGroup[] = [
    {
      id: 'development',
      label: 'Development',
      icon: <Code className="h-6 w-6" />,
      skills: [
        'JavaScript / TypeScript',
        'React & React Native',
        'Node.js',
        'Python',
        'SQL & NoSQL Databases',
        'C++, C#',
        'Docker & Containerization',
        'REST & GraphQL APIs'
      ]
    },
    {
      id: 'design',
      label: 'Design',
      icon: <Figma className="h-6 w-6" />,
      skills: [
        'UI/UX Design',
        'Figma & Design Systems',
        'Adobe Creative Suite',
        'Canva',
        'Graphic Design',
        'Social Media Content Creation',
        'Prototyping',
        'Video Editing',
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="h-6 w-6" />,
      skills: [
        'Network Security',
        'Penetration Testing',
        'Vulnerability Assessment',
        'Security Auditing',
        'Cryptography',
        'Authentication Systems',
        'Secure Coding Practices',
        'Threat Modeling'
      ]
    },
    {
      id: 'other',
      label: 'Other Skills',
      icon: <Briefcase className="h-6 w-6" />,
      skills: [
        'Photography',
        'Technical Writing',
        'Project Management',
        'Content Creation',
        'Data Analysis',
        'Communication',
        'Business Development',
        'Team Leadership'
      ]
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="skills" className="py-16 md:py-24 bg-gray-100" ref={sectionRef}>
      <div className="container px-4 mx-auto">
        <h2 className={`section-heading text-gray-800 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Skills</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {skillGroups.map((group, index) => (
            <div
              key={group.id}
              className={`brutalist-card bg-white shadow-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{
                transitionDelay: isVisible ? `${100 + index * 150}ms` : '0ms'
              }}
            >
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-300">
                <div className="text-gray-700">
                  {group.icon}
                </div>
                <h3 className="font-mono text-xl font-bold text-gray-800">
                  {group.label}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
