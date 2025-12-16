import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts } from '@/lib/blog';
import { BlogPost } from '@/types/blog';
import BlogLayout from '@/components/BlogLayout';
import Head from '@/components/Head';

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const blogPosts = await getAllBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        console.error('Error loading posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <BlogLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <p className="text-lg">Loading blog posts...</p>
          </div>
        </div>
      </BlogLayout>
    );
  }

  if (error) {
    return (
      <BlogLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </BlogLayout>
    );
  }

  if (posts.length === 0) {
    return (
      <BlogLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
          <p className="text-gray-600">No blog posts found.</p>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <Head
        title="Blog | Yash Thapliyal"
        description="Blog posts by Yash Thapliyal about software development, security, and technology."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{post.tags.join(', ')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogList; 