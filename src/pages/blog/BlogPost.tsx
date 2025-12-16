import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPost } from '@/lib/blog';
import { BlogPost as BlogPostType } from '@/types/blog';
import BlogLayout from '@/components/BlogLayout';
import Head from '@/components/Head';

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
      <Head
        title={`${post.title} | Yash Thapliyal`}
        description={post.description || post.title}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 break-words">{post.title}</h1>
          <div className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8 break-words">
            {new Date(post.date).toLocaleDateString()} • {post.tags.join(', ')}
          </div>
          <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none [&>p]:leading-loose [&>p]:mb-4 [&>h1]:mb-4 [&>h1]:mt-8 [&>h1]:font-mono [&>h1]:text-xl [&>h1]:sm:text-2xl [&>h2]:mt-6 [&>h2]:sm:mt-8 [&>h2]:mb-3 [&>h2]:sm:mb-4 [&>h2]:text-lg [&>h2]:sm:text-xl [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:sm:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:sm:ml-6 [&>ol]:mb-4 [&>li]:mb-2 [&>a]:text-gray-800 [&>a]:underline [&>a]:decoration-2 [&>a]:underline-offset-2 [&>a]:hover:text-black [&>a]:hover:decoration-gray-400 [&>a]:transition-all [&>a]:!font-bold [&>a]:break-words [&>pre]:overflow-x-auto [&>pre]:max-w-full [&>code]:break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, alt, src, title, ...props }) => {
                  // Size presets (responsive)
                  const sizeClasses: Record<string, string> = {
                    'small': 'max-w-full sm:max-w-xs',
                    'medium': 'max-w-full sm:max-w-md',
                    'large': 'max-w-full sm:max-w-2xl',
                    'full': 'w-full',
                  };

                  let className = 'mx-auto my-4 max-w-full h-auto';
                  let style: React.CSSProperties = {};
                  let actualTitle = title;
                  let sizeSpec: string | undefined;
                  let isInline = false;

                  // Parse title for size (format: "description|size" or just "size")
                  if (title?.includes('|')) {
                    const parts = title.split('|');
                    const lastPart = parts[parts.length - 1].trim();

                    // Check for inline modifier
                    if (lastPart.toLowerCase() === 'inline') {
                      isInline = true;
                      actualTitle = parts.slice(0, -1).join('|').trim() || undefined;
                    } else {
                      // Check if last part is a valid size
                      const isValidSize =
                        sizeClasses[lastPart.toLowerCase()] ||
                        lastPart.match(/^\d+(%|px|rem|em)$/);

                      if (isValidSize) {
                        sizeSpec = lastPart;
                        actualTitle = parts.slice(0, -1).join('|').trim() || undefined;
                      }
                    }
                  } else {
                    // No pipe, check if entire title is a size or inline
                    if (title?.toLowerCase() === 'inline') {
                      isInline = true;
                      actualTitle = undefined;
                    } else {
                      const isValidSize =
                        title && (sizeClasses[title.toLowerCase()] || title.match(/^\d+(%|px|rem|em)$/));

                      if (isValidSize) {
                        sizeSpec = title;
                        actualTitle = undefined;
                      }
                    }
                  }

                  // Apply inline styling (stack on mobile, side-by-side on desktop)
                  if (isInline) {
                    className = 'block sm:inline-block mx-auto sm:m-2 my-3 sm:my-0 align-top max-w-full sm:max-w-[45%] h-auto';
                  } else {
                    // Apply size
                    if (sizeSpec) {
                      if (sizeClasses[sizeSpec.toLowerCase()]) {
                        className += ` ${sizeClasses[sizeSpec.toLowerCase()]}`;
                      } else if (sizeSpec.match(/^\d+(%|px|rem|em)$/)) {
                        style.maxWidth = sizeSpec;
                        className += ' max-w-full'; // Ensure mobile doesn't overflow
                      }
                    }
                  }

                  return (
                    <img
                      src={src}
                      alt={alt || ''}
                      title={actualTitle}
                      className={className}
                      style={style}
                      {...props}
                    />
                  );
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </BlogLayout>
  );
};

export default BlogPost; 