import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const CoffeeTracker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set the page title
    document.title = "Coffee Tracker | Yash Thapliyal";
  }, []);

  return (
    <div className="relative w-full h-screen">
      <Button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90"
        size="icon"
        variant="outline"
      >
        <Home className="h-5 w-5" />
      </Button>
      <iframe
        src="https://coffee-website.fly.dev/"
        title="Coffee Tracker"
        className="w-full h-full border-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default CoffeeTracker; 