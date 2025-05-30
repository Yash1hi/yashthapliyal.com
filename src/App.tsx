import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import P5Sketch from "./pages/P5Sketch";
import BlogList from "./pages/blog/BlogList";
import BlogPost from "./pages/blog/BlogPost";
import CoffeeTracker from "./pages/CoffeeTracker";

const queryClient = new QueryClient();

// Component to track page views
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
