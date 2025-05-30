import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPost } from '@/lib/blog';
import { BlogPost as BlogPostType } from '@/types/blog';
import BlogLayout from '@/components/BlogLayout';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      const postData = await getBlogPost(slug);
      setPost(postData);
      setLoading(false);
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <BlogLayout>
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </BlogLayout>
    );
  }

  if (!post) {
    return (
      <BlogLayout>
        <div className="container mx-auto px-4 py-8">
          <p>Blog post not found</p>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 mb-8">
            {new Date(post.date).toLocaleDateString()} • {post.tags.join(', ')}
          </div>
          <div className="prose lg:prose-xl [&>p]:leading-loose [&>p]:mb-4 [&>h1]:mb-4 [&>h1]:mt-8 [&>h1]:font-mono [&>h1]:text-2xl [&>h2]:mt-8 [&>h2]:mb-4 [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800 [&>a]:transition-colors max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </BlogLayout>
  );
};

export default BlogPost; 