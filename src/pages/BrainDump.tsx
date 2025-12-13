import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const BrainDump = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Brain Dump | Yash Thapliyal";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Button
        onClick={() => navigate('/')}
        className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90"
        size="icon"
        variant="outline"
      >
        <Home className="h-5 w-5" />
      </Button>

      <div className="flex items-center justify-center h-screen p-8">
        <div className="bg-black rounded-lg w-full h-full" />
      </div>

    </div>
  );
};

export default BrainDump;
