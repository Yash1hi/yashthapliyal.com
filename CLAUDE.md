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
- **Coffee Tracker**: Custom page for tracking coffee consumption
- **P5 Sketch**: Interactive sketch page (MrSqueebleEXE route)

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

## Development Notes

- Vite config includes path alias `@` -> `./src`
- Development server runs on `localhost:8080`
- Markdown files are included as assets via `assetsInclude: ['**/*.md']`
- Uses `lovable-tagger` component tagger in development mode
- All routes must be added above the catch-all `*` route in App.tsx

## Deployment

- Built for deployment on Lovable platform
- Uses Dockerfile for containerization
- Includes fly.toml for Fly.io deployment
- Production build uses `serve` package to serve static files