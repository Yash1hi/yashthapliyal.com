import { useEffect } from 'react';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const Head = ({
  title = "Yash Thapliyal | AI Evals & Agent Simulation Engineer",
  description = "Yash Thapliyal is a founding software engineer at Scorecard in San Francisco, building evaluations (evals) and simulation for AI agents: tracing, LLM-as-judge metrics, monitoring and benchmarks.",
  image = "/Social_Media_Preview_portfolio.png",
  url = "https://www.yashthapliyal.com"
}: HeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags helper
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      const element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
        element.setAttribute(attribute, content);
      }
    };

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:image"]', 'content', image);
    updateMetaTag('meta[property="og:url"]', 'content', url);

    // Update Twitter tags
    updateMetaTag('meta[name="twitter:title"]', 'content', title);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', image);

    // Update standard meta description
    updateMetaTag('meta[name="description"]', 'content', description);

    // Canonical link for the current route, always on the www host the site is served from.
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://www.yashthapliyal.com${path === '/' ? '/' : path}`);
  }, [title, description, image, url]);

  return null;
};

export default Head;
