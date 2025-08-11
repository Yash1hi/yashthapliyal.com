# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on codebase
- `npm start` - Serve production build using serve

### Package Management
- `npm i` - Install dependencies
- Uses both npm (package-lock.json) and bun (bun.lockb) lockfiles

### Asset Management
- `npm run compress-photos` - Compress photos using Sharp (converts to WebP format)
  - Input: `public/Uncompressed-Photos/`
  - Output: `public/Portfolio-Photos-WebP/`
  - Settings: 80% quality, lossy WebP compression

## Architecture Overview

This is a personal portfolio website built with modern React stack:

### Tech Stack
- **Build Tool**: Vite with React plugin
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Analytics**: Google Analytics 4 (react-ga4)
- **Email**: EmailJS for contact forms

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   └── [other components like Hero, Navigation, etc.]
├── pages/               # Route components
│   └── blog/            # Blog-related pages
├── content/
│   └── blog/            # Markdown blog posts
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

### Key Features
- **Blog System**: Markdown-based with frontmatter parsing using `front-matter` package
- **Component Library**: Uses shadcn/ui components built on Radix UI
- **Responsive Design**: Tailwind CSS with custom animations and themes
- **Analytics System**: Comprehensive Google Analytics 4 tracking with custom events
- **Coffee Tracker**: Custom page for tracking coffee consumption
- **P5 Sketch**: Interactive sketch page (MrSqueebleEXE route)
- **Photo Compression**: Automated WebP conversion with Sharp

## Blog System

The blog system is file-based and uses markdown files with frontmatter:

- Blog posts are stored in `src/content/blog/` as `.md` files
- Each post requires frontmatter with: `title`, `date`, `description`, `tags`
- Blog posts are imported in `src/lib/blog.ts` and must be manually added to the `blogPosts` object
- The system uses Vite's `?raw` import to load markdown content
- Posts are sorted by date in descending order

### Adding New Blog Posts
1. Create `.md` file in `src/content/blog/`
2. Add frontmatter with required fields
3. Add import entry to `blogPosts` object in `src/lib/blog.ts`

## Styling Guidelines

- Uses Tailwind CSS with custom theme extensions
- Custom fonts: JetBrains Mono (monospace), Inter (sans-serif)
- CSS custom properties for theme colors (supports dark mode)
- Custom animations: `fade-in`, `slide-in`, `accordion-down/up`
- Component styling follows shadcn/ui patterns

### Link Styling in Blog Posts

Blog post links use a dual approach for styling due to Tailwind's prose class specificity:

1. **Tailwind utilities**: In `BlogPost.tsx`, use `[&>a]:` selectors with `!important` modifier:
   ```tsx
   className="prose [&>a]:!font-bold [&>a]:text-blue-600 [&>a]:underline"
   ```

2. **Custom CSS**: In `index.css`, add overrides for prose links:
   ```css
   .prose a {
     font-weight: 700 !important;
   }
   ```

The prose class from `@tailwindcss/typography` has strong specificity, so both approaches ensure reliable styling overrides.

## Analytics System

Comprehensive Google Analytics 4 implementation with custom event tracking:

- **Page tracking**: Automatic page view tracking for all routes
- **User interactions**: Navigation, form interactions, photo views, external links
- **Content engagement**: Blog post views, scroll depth tracking, social shares
- **Feature tracking**: Coffee tracker usage, P5 sketch interactions
- **Error tracking**: JavaScript errors and performance metrics
- **Setup**: Requires `VITE_GA_TRACKING_ID` environment variable

## Development Notes

- Vite config includes path alias `@` -> `./src`
- Development server runs on `localhost:8080` (not default port)
- Markdown files are included as assets via `assetsInclude: ['**/*.md']`
- Uses `lovable-tagger` component tagger in development mode
- All routes must be added above the catch-all `*` route in App.tsx
- TypeScript config is relaxed (`strict: false`) for rapid development
- Dual lockfiles: npm (package-lock.json) and bun (bun.lockb)

## Environment Variables

Required environment variables:
- `VITE_GA_TRACKING_ID` - Google Analytics 4 tracking ID for analytics

## Deployment

Multi-platform deployment setup:
- **Primary**: Lovable platform (automated deployment)
- **Secondary**: Fly.io deployment via fly.toml configuration
- **Docker**: Multi-stage build using Node 23.7.0
- **Serving**: Production build uses `serve` package for static file serving
- **Build outputs**: Supports both production (`npm run build`) and development (`npm run build:dev`) builds