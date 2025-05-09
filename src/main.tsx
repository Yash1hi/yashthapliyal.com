import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import App from './App.tsx'
import './index.css'

// Initialize Google Analytics
ReactGA.initialize('G-93S6NQ22EZ') 

createRoot(document.getElementById("root")!).render(<App />);
