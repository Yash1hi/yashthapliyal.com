import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import P5Sketch from "./pages/P5Sketch";
import BlogList from "./pages/blog/BlogList";
import BlogPost from "./pages/blog/BlogPost";
import CoffeeTracker from "./pages/CoffeeTracker";
import Photography from "./pages/Photography";
import Sandbox from "./pages/Sandbox";
import AllMusic from "./pages/AllMusic";
import BrainDump from "./pages/BrainDump";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";

const queryClient = new QueryClient();

// Component to track page views
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/MrSqueebleEXE" element={<P5Sketch />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/coffee-tracker" element={<CoffeeTracker />} />
          <Route path="/yash1photos" element={<Photography />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/music" element={<AllMusic />} />
          <Route path="/brain-dump" element={<BrainDump />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
