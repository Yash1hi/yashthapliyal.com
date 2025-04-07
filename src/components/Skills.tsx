import React, { useEffect, useRef } from 'react';

interface Skill {
  name: string;
  level: number; // 1-10
  category: 'development' | 'design' | 'security' | 'other';
}

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const skills: Skill[] = [
    // Development
    { name: 'JavaScript', level: 9, category: 'development' },
    { name: 'TypeScript', level: 8, category: 'development' },
    { name: 'React', level: 9, category: 'development' },
    { name: 'Node.js', level: 8, category: 'development' },
    { name: 'Python', level: 7, category: 'development' },
    { name: 'SQL', level: 8, category: 'development' },
    { name: 'AWS', level: 7, category: 'development' },
    { name: 'Docker', level: 7, category: 'development' },
    
    // Design
    { name: 'UI/UX Design', level: 8, category: 'design' },
    { name: 'Figma', level: 8, category: 'design' },
    { name: 'Adobe Photoshop', level: 9, category: 'design' },
    { name: 'Adobe Lightroom', level: 9, category: 'design' },
    { name: 'Typography', level: 7, category: 'design' },
    { name: 'Composition', level: 8, category: 'design' },
    
    // Security
    { name: 'Network Security', level: 8, category: 'security' },
    { name: 'Penetration Testing', level: 7, category: 'security' },
    { name: 'Vulnerability Assessment', level: 8, category: 'security' },
    { name: 'Security Auditing', level: 7, category: 'security' },
    { name: 'Cryptography', level: 6, category: 'security' },
    
    // Other
    { name: 'Photography', level: 9, category: 'other' },
    { name: 'Technical Writing', level: 8, category: 'other' },
    { name: 'Project Management', level: 7, category: 'other' },
  ];

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

  const categories = [
    { id: 'development', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'security', label: 'Security' },
    { id: 'other', label: 'Other Skills' },
  ];

  return (
    <section id="skills" className="py-16 md:py-24 bg-[#f9f9f9]" ref={sectionRef}>
      <div className="container px-4 mx-auto">
        <h2 className="section-heading">Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {categories.map((category) => (
            <div key={category.id} className="fade-in-section brutalist-card">
              <h3 className="font-mono text-xl font-bold mb-6 pb-2 border-b border-black">
                {category.label}
              </h3>
              <div className="space-y-4">
                {skills
                  .filter((skill) => skill.category === category.id)
                  .map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm">{skill.name}</span>
                        <span className="text-xs">{skill.level}/10</span>
                      </div>
                      <div className="h-2 w-full bg-[#eee] border border-black">
                        <div 
                          className="h-full bg-black" 
                          style={{ width: `${(skill.level / 10) * 100}%` }}
                        ></div>
                      </div>
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
