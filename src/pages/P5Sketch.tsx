import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const P5Sketch = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        {/* <h1 className="text-3xl font-bold mb-6">Interactive Sketch</h1> */}
        <div className="w-full aspect-video">
          <div className="flex justify-center items-center">
            <iframe 
              src="https://editor.p5js.org/yash.thapliyal.007/full/Ko7twdgmG"
              className="w-[500px] h-[500px] border-2 border-black rounded-lg"
              title="p5.js Sketch"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default P5Sketch; 