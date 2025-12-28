import React from 'react';
import Navigation from '@/components/Navigation';
import Head from '@/components/Head';
import { analytics } from '@/lib/analytics';

const Projects = () => {
  // Project data
  const projectsData = {
    trailofbits: {
      title: "Trail of Bits Resource Page",
      description: "Aggregated resources, raw HTML/CSS",
      tags: ["Javascript", "HTML", "CSS"],
      link: "https://www.trailofbits.com/opensource/",
    },
    proofgenerator: {
      title: "Logical Proof Generator",
      description: "Automatically generates logical proofs from custom grammatical inputs.",
      tags: ["Scala"],
      link: "https://github.com/Yash1hi/Proof-Generator-3434",
    },
    medication: {
      title: "Medication Management System",
      description: "Automated Pill Container and App - 1st place T9Hacks 2025.",
      tags: ["NodeJS", "Twilio", "PostgreSQL", "Arduino"],
      link: "https://www.linkedin.com/posts/suctuk_i-was-fortunate-to-participate-in-the-t9hacks-ugcPost-7298820077385039872-Lhxf",
    },
    sqeeble: {
      title: "Clean With Sqeeble",
      description: "AI powered room cleaning app built in 2 hours for Hackbubu 2025.",
      tags: ["NextJS", "React", "Gemini Nano Banana", "React-Camera-Kit"],
      link: "https://github.com/Yash1hi/Clean-With-Sqeeble",
    },
    wav: {
      title: "WAV music player",
      description: "Website for SolidAudio's WAV music player: a digital -> physical music player.",
      tags: ["HTML/CSS"],
      link: "https://wavmusicplayer.com/",
    },
    nxsweep: {
      title: "NXSweep",
      description: "Vulnerability scanning script based on NX supply chain attack.",
      tags: ["Typescript"],
      link: "https://www.yashthapliyal.com/blog/nxsweep",
    },
    scorecard: {
      title: "Scorecard",
      description: "AI Evaluation platform.",
      tags: ["NextJS", "PostgreSQL", "LiteLLM", "A Lot of Other Stuff TBH"],
      link: "https://www.scorecard.io/",
    },
    tiktokalytics: {
      title: "tiktokalytics",
      description: "Tiktok data analytics tool.",
      tags: ["NextJS", "ShadCN"],
      link: "https://github.com/Yash1hi/tiktokalytics",
    },
    lookloom: {
      title: "LookLoom",
      description: "A digital pixel clothing closet.",
      tags: ["NextJS", "Gemini Nano Banana", "PostgreSQL"],
      link: "https://lookloom.fit/",
    },
  };

  // Project display order - just reorder these IDs to change the order!
  const projectOrder = [
    'scorecard',
    'lookloom',
    'sqeeble',
    'trailofbits',
    'nxsweep',
    'proofgenerator',
    'medication',
    'tiktokalytics',
    'wav',
  ];

  return (
    <div className="min-h-screen">
      <Head
        title="Projects | Yash Thapliyal"
        description="Software projects by Yash Thapliyal - from security tools to AI-powered applications."
      />
      <Navigation />

      <section className="py-16 md:py-24 pt-32">
        <div className="container px-4 mx-auto max-w-6xl">
          <h1 className="font-mono text-4xl md:text-5xl font-bold mb-12">projects</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectOrder.map((projectId) => {
              const project = projectsData[projectId];
              return (
                <a
                  key={projectId}
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
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
