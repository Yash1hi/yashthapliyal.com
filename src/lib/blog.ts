import { BlogPost, BlogPostMetadata } from '@/types/blog';
import frontMatter from 'front-matter';

// Import all markdown files
const blogPosts = {
  // 'getting-started-with-react': () => import('@/content/blog/getting-started-with-react.md?raw'),
  'how-to-graduate-at-19-with-a-BS-in-CS': () => import('@/content/blog/how-to-graduate-at-19-with-a-BS-in-CS.md?raw'),
  'every-CU-CS-class-rated': () => import('@/content/blog/every-CU-CS-class-rated.md?raw'),
  'coffee-tracker-day-project': () => import('@/content/blog/coffee-tracker-day-project.md?raw'),
  'def-con-33-top-talk-names': () => import('@/content/blog/def-con-33-top-talk-names.md?raw'),
  'nxsweep': () => import('@/content/blog/nxsweep.md?raw'),
  'web-server-deploy-rpi': () => import('@/content/blog/web-server-deploy-rpi.md?raw'),
  'hackbubu2025-sqeeble': () => import('@/content/blog/hackbubu2025-sqeeble.md?raw'),
  // 'how-i-travel-cheap': () => import('@/content/blog/how-i-travel-cheap.md?raw')
};

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  console.log('Fetching all blog posts...');
  try {
    const posts = await Promise.all(
      Object.entries(blogPosts).map(async ([slug, importFn]) => {
        console.log(`Loading post: ${slug}`);
        const content = await importFn();
        console.log(`Content loaded for ${slug}:`, content);
        const { attributes, body } = frontMatter(content.default);
        console.log(`Parsed frontmatter for ${slug}:`, attributes);
        
        return {
          slug,
          content: body,
          ...attributes as BlogPostMetadata
        };
      })
    );

    console.log('All posts loaded:', posts);
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    throw error;
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    console.log(`Fetching blog post: ${slug}`);
    const importFn = blogPosts[slug];
    if (!importFn) {
      console.log(`No import function found for slug: ${slug}`);
      return null;
    }

    const content = await importFn();
    console.log(`Content loaded for ${slug}:`, content);
    const { attributes, body } = frontMatter(content.default);
    console.log(`Parsed frontmatter for ${slug}:`, attributes);
    
    return {
      slug,
      content: body,
      ...attributes as BlogPostMetadata
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
} 