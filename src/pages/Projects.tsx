import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Head from '@/components/Head';
import { analytics } from '@/lib/analytics';
import { usePostHog } from '@posthog/react';

const experienceData = [
  {
    title: "Founding Software Engineer",
    company: "Scorecard AI",
    date: "Oct 2025 — Present",
    link: "https://www.scorecard.io/",
    current: true,
  },
  {
    title: "Cyber Security Intern",
    company: "Federal Home Loan Bank of SF",
    date: "Jun 2025 — Sep 2025",
    link: null,
    current: false,
  },
  {
    title: "Software Developer",
    company: "Alliant National Title Insurance",
    date: "Aug 2024 — May 2025",
    link: null,
    current: false,
  },
  {
    title: "Technical Marketing Intern",
    company: "Trail of Bits",
    date: "Jun 2024 — Aug 2024",
    link: "https://www.trailofbits.com/",
    current: false,
  },
  {
    title: "BS, Computer Science",
    company: "University of Colorado Boulder",
    date: "Jun 2023 — May 2025",
    link: null,
    current: false,
  },
  {
    title: "Computer Science",
    company: "De Anza College",
    date: "Aug 2022 — Aug 2023",
    link: null,
    current: false,
  },
];

const Projects = () => {
  const posthog = usePostHog();
  const [loaded, setLoaded] = useState(false);
  const [expIndex, setExpIndex] = useState(0);
  const [expPhase, setExpPhase] = useState<'visible' | 'fade-date' | 'slide-role' | 'entering'>('visible');
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    setLoaded(true);
  }, []);

  const changeExp = (next: number, dir: 'left' | 'right') => {
    if (expPhase !== 'visible') return;
    setDirection(dir);
    setExpPhase('fade-date');
    setTimeout(() => {
      setExpPhase('slide-role');
      setTimeout(() => {
        setExpIndex(next);
        setExpPhase('entering');
        setTimeout(() => {
          setExpPhase('visible');
        }, 50);
      }, 250);
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        changeExp((expIndex - 1 + experienceData.length) % experienceData.length, 'right');
      } else if (e.key === 'ArrowRight') {
        changeExp((expIndex + 1) % experienceData.length, 'left');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expIndex, expPhase]);

  // Project data
  const projectsData = {
    trailofbits: {
      title: "Trail of Bits Resource Page",
      description: "Aggregated resources, raw HTML/CSS",
      link: "https://www.trailofbits.com/opensource/",
    },
    proofgenerator: {
      title: "Logical Proof Generator",
      description: "Automatically generates logical proofs from custom grammatical inputs.",
      link: "https://github.com/Yash1hi/Proof-Generator-3434",
    },
    medication: {
      title: "Medication Management",
      description: "1st place T9Hacks 2025.",
      link: "https://www.linkedin.com/posts/suctuk_i-was-fortunate-to-participate-in-the-t9hacks-ugcPost-7298820077385039872-Lhxf",
    },
    sqeeble: {
      title: "Clean With Sqeeble",
      description: "1st place Hackbubu 2025.",
      link: "https://github.com/Yash1hi/Clean-With-Sqeeble",
    },
    wav: {
      title: "WAV music player",
      description: "Website for SolidAudio's WAV music player: a digital -> physical music player.",
      link: "https://wavmusicplayer.com/",
    },
    nxsweep: {
      title: "NXSweep",
      description: "Vulnerability scanning script based on NX supply chain attack.",
      link: "https://www.yashthapliyal.com/blog/nxsweep",
    },
    scorecard: {
      title: "Scorecard",
      description: "AI Agent Simulation Platform.",
      link: "https://www.scorecard.io/",
    },
    tiktokalytics: {
      title: "tiktokalytics",
      description: "Tiktok data analytics tool.",
      link: "https://github.com/Yash1hi/tiktokalytics",
    },
    lookloom: {
      title: "LookLoom",
      description: "A digital pixel clothing closet.",
      link: "https://lookloom.fit/",
    },
    flighttracker: {
      title: "Frontier Flight Tracker",
      description: "Unlimited flights, but no flights.",
      link: null,
    },
    openclaw: {
      title: "Personal Agent Setup",
      description: "Finally, Jarvis.",
      link: null,
    },
    homeserver: {
      title: "Home Server",
      description: "Basically wakanda.",
      link: null,
    },
  };

  // Project display order - just reorder these IDs to change the order!
  const projectOrder = [
    'scorecard',
    'sqeeble',
    'medication',
  ];

  // Daily tooling display order
  const dailyToolingOrder = [
    'flighttracker',
    'openclaw',
    'homeserver',
  ];

  // Archived projects - kept in projectsData but not displayed. Move an ID back to projectOrder to show it again.
  const archivedProjects = [
    'trailofbits',
    'nxsweep',
    'proofgenerator',
    'tiktokalytics',
    'lookloom',
    'wav',
  ];

  const renderProjectCard = (projectId: string, index: number) => {
    const project = projectsData[projectId];
    const className = `border border-black p-6 transition-colors duration-150 group ${project.link ? 'hover:bg-black' : ''} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
    const style = { transition: `color 150ms, background-color 150ms, opacity 700ms ease ${100 + index * 75}ms, transform 700ms ease ${100 + index * 75}ms` };
    const content = (
      <>
        <h2 className={`font-mono text-xl font-bold mb-3 ${project.link ? 'group-hover:text-white' : ''}`}>{project.title}</h2>
        <p className={`text-sm text-gray-700 ${project.link ? 'group-hover:text-gray-200' : ''}`}>{project.description}</p>
      </>
    );

    if (!project.link) {
      return <div key={projectId} className={className} style={style}>{content}</div>;
    }

    return (
      <a
        key={projectId}
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onClick={() => { analytics.trackExternalLink(project.link, 'project'); posthog?.capture('project_link_clicked', { project_title: project.title, project_url: project.link }); }}
      >
        {content}
      </a>
    );
  };

  return (
    <div className="min-h-screen">
      <Head
        title="Projects | Yash Thapliyal"
        description="Software projects by Yash Thapliyal - from security tools to AI-powered applications."
      />
      <Navigation />

      <section className="py-16 md:py-24 pt-32">
        <div className="container px-4 mx-auto max-w-6xl">
          {/* Experience Section */}
          <div className={`mb-6 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Date label - fades out first */}
            <div className={`flex items-center gap-3 mb-4 transition-opacity duration-200 ${
              expPhase === 'fade-date' || expPhase === 'slide-role' ? 'opacity-0' : expPhase === 'entering' ? 'opacity-0' : 'opacity-100'
            }`}>
              {experienceData[expIndex].current ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              ) : (
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-300"></span>
                </span>
              )}
              <span className="font-mono text-sm uppercase tracking-widest text-gray-500">
                {experienceData[expIndex].current ? 'right now' : experienceData[expIndex].date}
              </span>
            </div>
            {/* Role text - slides out horizontally then enters from opposite side */}
            <div className="flex items-center gap-4 overflow-hidden">
              <div className={`min-w-0 flex-1 transition-all duration-250 ease-in-out ${
                expPhase === 'slide-role'
                  ? `opacity-0 ${direction === 'left' ? '-translate-x-12' : 'translate-x-12'}`
                  : expPhase === 'entering'
                  ? `opacity-0 ${direction === 'left' ? 'translate-x-12' : '-translate-x-12'}`
                  : 'opacity-100 translate-x-0'
              }`} style={{ transitionDuration: expPhase === 'visible' ? '300ms' : '250ms' }}>
                {experienceData[expIndex].link ? (
                  <a
                    href={experienceData[expIndex].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <p className="font-mono text-2xl md:text-3xl font-bold text-black group-hover:text-gray-500 transition-colors duration-200">
                      {experienceData[expIndex].title}{' '}
                      <span className="text-gray-400 group-hover:text-gray-500">@</span>{' '}
                      {experienceData[expIndex].company}
                    </p>
                  </a>
                ) : (
                  <p className="font-mono text-2xl md:text-3xl font-bold text-black">
                    {experienceData[expIndex].title}{' '}
                    <span className="text-gray-400">@</span>{' '}
                    {experienceData[expIndex].company}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => changeExp((expIndex - 1 + experienceData.length) % experienceData.length, 'right')}
                  className="font-mono text-gray-400 hover:text-black transition-colors duration-200 text-2xl leading-none px-1"
                  aria-label="Previous experience"
                >
                  &larr;
                </button>
                <button
                  onClick={() => changeExp((expIndex + 1) % experienceData.length, 'left')}
                  className="font-mono text-gray-400 hover:text-black transition-colors duration-200 text-2xl leading-none px-1"
                  aria-label="Next experience"
                >
                  &rarr;
                </button>
              </div>
            </div>
          </div>

          <h1 className={`font-mono text-sm uppercase tracking-widest text-gray-500 mb-6 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>economically viable projects</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectOrder.map((projectId, index) => renderProjectCard(projectId, index))}
          </div>

          <h2 className={`font-mono text-sm uppercase tracking-widest text-gray-500 mt-16 mb-6 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>daily tooling</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dailyToolingOrder.map((projectId, index) => renderProjectCard(projectId, projectOrder.length + index))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Projects;
