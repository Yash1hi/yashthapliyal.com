import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import App from './App.tsx'
import './index.css'
import posthog from 'posthog-js'
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'

// Initialize Google Analytics
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-93S6NQ22EZ';
ReactGA.initialize(GA_TRACKING_ID);

// Initialize PostHog
posthog.init('phc_uEUo58wBocjrqCpNzuZa7FrNQH7Xy96ZpFnkDzVMpKs3', {
  api_host: 'https://t.yashthapliyal.com',
  ui_host: 'https://us.posthog.com',
  defaults: '2026-01-30',
});

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <PostHogErrorBoundary>
      <App />
    </PostHogErrorBoundary>
  </PostHogProvider>
);
