import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';

interface Photo {
  id: number;
  imageUrl: string;
}

const Photography = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    document.title = "Photography Portfolio | Yash Thapliyal";
    
    // Dynamically import all photos from the Portfolio-Photos-Compressed folder
    const photoModules = import.meta.glob('/public/Portfolio-Photos-Compressed/*.{jpg,jpeg,png}', {
      eager: true,
      as: 'url'
    });

    const photoList: Photo[] = Object.entries(photoModules).map(([path, url], index) => {
      return {
        id: index + 1,
        imageUrl: url as string
      };
    });

    setPhotos(photoList);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Photo Grid */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="overflow-hidden">
              <img
                src={photo.imageUrl}
                alt="Photography"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photography; 