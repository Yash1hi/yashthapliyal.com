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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <h1 className="font-mono text-5xl md:text-7xl font-black mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-4 rounded-2xl shadow-2xl inline-block transform hover:scale-105 transition-transform duration-300">
              Photography
            </span>
          </h1>
          <p className="font-mono text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Fashion, Weddings, Graduation, Creative, and more. 
            <br />
            <a 
              href="https://instagram.com/yash1photos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-gray-700 transition-colors font-semibold"
            >
              @yash1photos
            </a>
          </p>
        </div>

        {/* Masonry Photo Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="break-inside-avoid mb-6 group cursor-pointer"
              onClick={() => openModal(photo)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {!loadedImages.has(photo.id) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
                )}
                <img
                  src={photo.imageUrl}
                  alt={`Photography by Yash Thapliyal - ${photo.filename}`}
                  className={`w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${
                    loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(photo.id)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-mono text-sm font-medium">
                    {photo.filename.replace(/[-_]/g, ' ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={closeModal}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-16 right-0 font-mono text-white hover:text-gray-300 text-xl font-bold z-10 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl transition-colors duration-300"
            >
              CLOSE ×
            </button>
            <img
              src={selectedPhoto.imageUrl}
              alt={`Photography by Yash Thapliyal - ${selectedPhoto.filename}`}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-6 font-mono text-white text-lg bg-black/70 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold">
              {selectedPhoto.filename.replace(/[-_]/g, ' ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photography; 