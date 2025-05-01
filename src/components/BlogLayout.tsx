import React from 'react';
import Navigation from './Navigation';

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
};

export default BlogLayout; 