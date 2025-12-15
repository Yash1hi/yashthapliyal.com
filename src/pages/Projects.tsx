import React from 'react';
import Navigation from '@/components/Navigation';
import { analytics } from '@/lib/analytics';

const Projects = () => {
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
      description: "Full stack web application for medication tracking and management; integrated with medication dispenser.",
      tags: ["NodeJS", "Twilio", "PostgreSQL", "Arduino"],
      link: "https://www.linkedin.com/posts/suctuk_i-was-fortunate-to-participate-in-the-t9hacks-ugcPost-7298820077385039872-Lhxf",
    },
    {
      id: 4,
      title: "Clean With Sqeeble",
      description: "AI powered room cleaning app built in 2 hours for Hackbubu 2025.",
      tags: ["NextJS", "React", "Gemini Nano Banana", "React-Camera-Kit"],
      link: "https://github.com/Yash1hi/Clean-With-Sqeeble",
    },
    {
      id: 5,
      title: "WAV music player",
      description: "Website for SolidAudio's WAV music player: a digital -> physical music player.",
      tags: ["HTML/CSS"],
      link: "https://wavmusicplayer.com/",
    },
    {
      id: 6,
      title: "NXSweep",
      description: "Script that scans your system for the vulnerability used in the NX supply chain attack.",
      tags: ["Typescript"],
      link: "https://www.yashthapliyal.com/blog/nxsweep",
    },
    {
      id: 7,
      title: "Scorecard",
      description: "AI Evaluation's platform.",
      tags: ["NextJS", "PostgreSQL", "LiteLLM", "A Lot of Other Stuff TBH"],
      link: "https://www.scorecard.io/",
    },
    {
      id: 8,
      title: "tiktokalytics",
      description: "Tiktok data analytics tool.",
      tags: ["NextJS", "ShadCN"],
      link: "https://github.com/Yash1hi/tiktokalytics",
    },
    {
      id: 9,
      title: "LookLoom",
      description: "A digital pixel clothing closet.",
      tags: ["NextJS", "Gemini Nano Banana", "PostgreSQL"],
      link: "https://lookloom.fit/",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-16 md:py-24 pt-32">
        <div className="container px-4 mx-auto max-w-6xl">
          <h1 className="font-mono text-4xl md:text-5xl font-bold mb-12">projects</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {softwareProjects.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-black p-6 hover:bg-black transition-colors group"
                onClick={() => analytics.trackExternalLink(project.link, 'project')}
              >
                <h2 className="font-mono text-xl font-bold mb-3 group-hover:text-white">{project.title}</h2>
                <p className="text-sm mb-4 text-gray-700 group-hover:text-gray-200">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="font-mono text-xs border border-black group-hover:border-white group-hover:text-white px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
