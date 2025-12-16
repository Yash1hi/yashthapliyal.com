import { useEffect } from 'react';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const Head = ({
  title = "Yash Thapliyal | Developer & Creative",
  description = "Personal portfolio of Yash Thapliyal, showcasing software development, cyber security, photography, and design work.",
  image = "/Social_Media_Preview_portfolio.png",
  url = "https://yashthapliyal.com"
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
  }, [title, description, image, url]);

  return null;
};

export default Head;
