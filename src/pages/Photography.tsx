import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';

interface Photo {
  id: number;
  imageUrl: string;
  filename: string;
}

const Photography = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    document.title = "Photography Portfolio | Yash Thapliyal";
    
    // Dynamically import all photos from the Portfolio-Photos-Compressed folder
    const photoModules = import.meta.glob('/public/Portfolio-Photos-Compressed/*.{jpg,jpeg,png}', {
      eager: true,
      as: 'url'
    });

    const photoList: Photo[] = Object.entries(photoModules).map(([path, url], index) => {
      const filename = path.split('/').pop()?.split('.')[0] || '';
      return {
        id: index + 1,
        imageUrl: url as string,
        filename
      };
    });

    setPhotos(photoList);
  }, []);

  const handleImageLoad = (photoId: number) => {
    setLoadedImages(prev => new Set(prev).add(photoId));
  };

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="font-mono text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-black text-white px-3 py-2 rounded-md">Photography</span>
          </h1>
          <p className="font-mono text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A collection of moments captured through my lens — from portraits and events 
            to candid street photography and creative compositions.
          </p>
        </div>

        {/* Masonry Photo Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="break-inside-avoid mb-4 group cursor-pointer"
              onClick={() => openModal(photo)}
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                {!loadedImages.has(photo.id) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                )}
                <img
                  src={photo.imageUrl}
                  alt={`Photography by Yash Thapliyal - ${photo.filename}`}
                  className={`w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ${
                    loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(photo.id)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 font-mono text-white hover:text-gray-300 text-lg font-bold z-10"
            >
              CLOSE ×
            </button>
            <img
              src={selectedPhoto.imageUrl}
              alt={`Photography by Yash Thapliyal - ${selectedPhoto.filename}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 font-mono text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
              {selectedPhoto.filename}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photography; 