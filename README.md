# yashthapliyal.com

Personal portfolio website built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Blog** — Markdown-based blog with frontmatter, GFM support, and image sizing controls
- **Photography** — Photo gallery with automated WebP compression and thumbnail generation
- **Projects** — Showcase of personal projects
- **Music** — Displays current top songs with Spotify/YouTube links
- **Coffee Tracker** — Custom page for tracking coffee consumption
- **P5 Sketch** — Interactive generative art sketch
- **Contact** — Contact form powered by EmailJS
- **Analytics** — GA4 event tracking across all features

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI)
- **Routing**: React Router v6
- **State**: TanStack Query

## Getting Started

Requires Node.js and npm.

```sh
npm install
npm run dev        # starts dev server on localhost:8080
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run compress-photos` | Convert photos to WebP (80% quality) |
| `npm run generate-thumbnails` | Generate 400x600 thumbnails (60% quality) |

## Adding a Blog Post

1. Create a `.md` file in `src/content/blog/` with frontmatter (`title`, `date`, `description`, `tags`)
2. Add an import entry to the `blogPosts` object in `src/lib/blog.ts`

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_GA_TRACKING_ID` | Google Analytics 4 tracking ID |

## Deployment

- **Primary**: Lovable platform
- **Secondary**: Fly.io (Docker, Node 23.7.0, `serve` for static files)
