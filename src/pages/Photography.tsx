import React, { useEffect, useState, useRef, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import { analytics } from '@/lib/analytics';

interface Photo {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
  filename: string;
  loaded: boolean;
  thumbnailLoaded: boolean;
  inView: boolean;
  aspectRatio?: number;
  blurDataUrl?: string;
}

const Photography = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map());
  const [thumbnailCache, setThumbnailCache] = useState<Map<string, HTMLImageElement>>(new Map());

  const imageObserver = useCallback((node: HTMLDivElement, photoId: number) => {
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const photo = photos.find(p => p.id === photoId);
          if (photo && !photo.thumbnailLoaded) {
            setPhotos(prev => prev.map(p =>
              p.id === photoId ? { ...p, inView: true } : p
            ));

            // Load this thumbnail and next 2
            const currentIndex = photos.findIndex(p => p.id === photoId);
            const nextPhotos = photos.slice(currentIndex, currentIndex + 3);

            nextPhotos.forEach(photo => {
              if (!photo.thumbnailLoaded) {
                const img = new Image();
                img.src = photo.thumbnailUrl;
                img.onload = () => {
                  setThumbnailCache(prev => new Map(prev.set(photo.thumbnailUrl, img)));
                  setPhotos(prev => prev.map(p =>
                    p.id === photo.id ? { ...p, thumbnailLoaded: true } : p
                  ));
                };
              }
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });

    observer.observe(node);
  }, [photos]);

  useEffect(() => {
    document.title = "Photography Portfolio | Yash Thapliyal";
    
    // Get photo paths with eager loading to get URLs, but load images lazily
    const photoModules = import.meta.glob('/public/Portfolio-Photos-WebP/*.webp', {
      eager: true,
      as: 'url'
    });

    // Get thumbnail paths
    const thumbnailModules = import.meta.glob('/public/Portfolio-Photos-Thumbnails/*.webp', {
      eager: true,
      as: 'url'
    });

    const photoList: Photo[] = Object.entries(photoModules).map(([path, url], index) => {
      const filename = path.split('/').pop()?.split('.')[0] || '';
      const thumbnailKey = Object.keys(thumbnailModules).find(thumbPath =>
        thumbPath.includes(`${filename}-thumb.webp`)
      );
      const thumbnailUrl = thumbnailKey ? thumbnailModules[thumbnailKey] as string : url as string;

      return {
        id: index + 1,
        imageUrl: url as string,
        thumbnailUrl,
        filename,
        loaded: false,
        thumbnailLoaded: false,
        inView: false
      };
    });

    setPhotos(photoList);

    // Preload first 3 thumbnails
    photoList.slice(0, 3).forEach(photo => {
      const img = new Image();
      img.src = photo.thumbnailUrl;
      img.onload = () => {
        setThumbnailCache(prev => new Map(prev.set(photo.thumbnailUrl, img)));
        setPhotos(prev => prev.map(p =>
          p.id === photo.id ? { ...p, thumbnailLoaded: true } : p
        ));
      };
    });

    return () => {
      // Cleanup handled by individual observers
    };
  }, []);

  const handleImageLoad = (photoId: number) => {
    // Image load handler - can be used for additional effects
  };

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
    analytics.trackPhotoModalOpen(photo.filename);

    // Preload full-size image if not already cached
    if (!imageCache.has(photo.imageUrl)) {
      const img = new Image();
      img.src = photo.imageUrl;
      img.onload = () => {
        setImageCache(prev => new Map(prev.set(photo.imageUrl, img)));
        setPhotos(prev => prev.map(p =>
          p.id === photo.id ? { ...p, loaded: true } : p
        ));
      };
    }
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
              onClick={() => analytics.trackInstagramClick()}
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
              ref={(node) => {
                if (node) {
                  imageObserver(node, photo.id);
                }
              }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Enhanced skeleton with shimmer effect */}
                {!photo.thumbnailLoaded && (
                  <div className="relative overflow-hidden">
                    <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-64 md:h-80 lg:h-96 rounded-2xl" />
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                )}

                {photo.thumbnailLoaded && (
                  <div className="relative">
                    {/* Blur placeholder */}
                    {photo.blurDataUrl && (
                      <img
                        src={photo.blurDataUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105 transition-opacity duration-300"
                        style={{ opacity: photo.thumbnailLoaded ? 0 : 1 }}
                      />
                    )}

                    <img
                      src={photo.thumbnailUrl}
                      alt={`Photography by Yash Thapliyal - ${photo.filename}`}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-all duration-700 ease-out opacity-0 animate-[fadeIn_0.5s_ease-in-out_0.2s_forwards]"
                      onLoad={() => handleImageLoad(photo.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-mono text-sm font-medium">
                        {photo.filename.replace(/[-_]/g, ' ')}
                      </div>
                    </div>
                  </div>
                )}
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
            
            <div className="relative">
              {/* Show loading state if image not in cache */}
              {!imageCache.has(selectedPhoto.imageUrl) && (
                <div className="flex items-center justify-center bg-gray-800 rounded-2xl p-20">
                  <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              <img
                src={selectedPhoto.imageUrl}
                alt={`Photography by Yash Thapliyal - ${selectedPhoto.filename}`}
                className={`max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl transition-opacity duration-300 ${
                  imageCache.has(selectedPhoto.imageUrl) ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
                onLoad={() => {
                  if (!imageCache.has(selectedPhoto.imageUrl)) {
                    const img = new Image();
                    img.src = selectedPhoto.imageUrl;
                    setImageCache(prev => new Map(prev.set(selectedPhoto.imageUrl, img)));
                  }
                }}
              />
            </div>
            
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