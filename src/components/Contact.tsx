import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import emailjs from '@emailjs/browser';

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace these with your actual EmailJS credentials
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message
      };

      await emailjs.send(
        'PersonalWebsiteEmail', // Replace with your service ID
        'template_8tnizvf', // Replace with your template ID
        templateParams,
        'V4jN3130n0_JlkWI6' // Replace with your public key
      );

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
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
    <section id="contact" className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <h2 className="section-heading">Contact</h2>

        <div className="grid grid-cols-1 gap-12">
          <div className="fade-in-section">
            <h3 className="font-mono text-2xl font-bold mb-4">Let's Connect</h3>
            <p className="mb-6">
              Interested in working together? Have questions about my work? 
              Feel free to reach out and I'll get back to you as soon as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center border border-black mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-sm">EMAIL</p>
                  <a href="mailto:yash.thapliyal.007@gmail.com" className="text-lg hover:underline">yash.thapliyal.007@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center border border-black mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-sm">GITHUB</p>
                  <a href="https://github.com/Yash1hi" target="_blank" rel="noopener noreferrer" className="text-lg hover:underline">github.com/Yash1hi</a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center border border-black mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-sm">LINKEDIN</p>
                  <a href="https://www.linkedin.com/in/yash1hi/" target="_blank" rel="noopener noreferrer" className="text-lg hover:underline">linkedin.com/in/yash1hi</a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            <div className="fade-in-section h-full">
              <form onSubmit={handleSubmit} className="brutalist-card h-full">
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
            </div>

            <div className="fade-in-section h-full">
              <div className="brutalist-card h-full">
                <iframe
                  src="https://calendar.notion.so/meet/yashthapliyal/yash1hi"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="border border-black rounded-md"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
