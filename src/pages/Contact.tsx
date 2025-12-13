import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/components/ui/use-toast';
import emailjs from '@emailjs/browser';
import { analytics } from '@/lib/analytics';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (!formData.name && !formData.email && !formData.message) {
      analytics.trackContactFormStart();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    analytics.trackContactFormSubmit();

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message
      };

      await emailjs.send(
        'PersonalWebsiteEmail',
        'template_8tnizvf',
        templateParams,
        'V4jN3130n0_JlkWI6'
      );

      analytics.trackContactFormSuccess();

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });

      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      analytics.trackContactFormError(error instanceof Error ? error.message : 'Unknown error');

      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="mb-12">
            <div className="mb-3">
              <label htmlFor="name" className="block font-mono text-sm mb-1">NAME</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-black p-2 focus:ring-0 focus:outline-none font-mono"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="block font-mono text-sm mb-1">EMAIL</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-black p-2 focus:ring-0 focus:outline-none font-mono"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="block font-mono text-sm mb-1">MESSAGE</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-black p-2 focus:ring-0 focus:outline-none font-mono"
              ></textarea>
            </div>

            <button
              type="submit"
              className="brutalist-button w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>

          <div className="flex justify-center gap-8">
            <a
              href="mailto:yash.thapliyal.007@gmail.com"
              className="w-12 h-12 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors"
              onClick={() => analytics.trackExternalLink('mailto:yash.thapliyal.007@gmail.com', 'email')}
              aria-label="Email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>

            <a
              href="https://github.com/Yash1hi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors"
              onClick={() => analytics.trackExternalLink('https://github.com/Yash1hi', 'github')}
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/yash1hi/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors"
              onClick={() => analytics.trackExternalLink('https://www.linkedin.com/in/yash1hi/', 'linkedin')}
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
