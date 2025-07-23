import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import App from './App.tsx'
import './index.css'

// Initialize Google Analytics
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-93S6NQ22EZ';
ReactGA.initialize(GA_TRACKING_ID); 

createRoot(document.getElementById("root")!).render(<App />);
