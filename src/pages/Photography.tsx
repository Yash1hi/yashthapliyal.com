import React, { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import Head from '@/components/Head';
import { analytics } from '@/lib/analytics';
import { usePostHog } from '@posthog/react';
import { useDevPhotoLayout } from '@/components/dev/DevPhotoLayout';
import photoDimensions from '@/data/photo-dimensions.json';
import photoOrder from '@/data/photo-order.json';

interface Photo {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
  filename: string;
}

// Written by scripts/generateThumbnails.js
interface PhotoDimensions {
  width: number;
  height: number;
  color: string;
}

const dimensionsOf = (filename: string): PhotoDimensions | undefined =>
  (photoDimensions as Record<string, PhotoDimensions>)[filename];

// Fits the lightbox photo on screen, leaving room above it for the close button.
const lightboxStyle = (dims?: PhotoDimensions): React.CSSProperties | undefined =>
  dims && {
    aspectRatio: `${dims.width} / ${dims.height}`,
    width: `min(80rem, 100vw - 3rem, (100vh - 9rem) * ${dims.width / dims.height})`,
    backgroundColor: dims.color,
  };

// Starts transparent and fades in once loaded, instead of popping in.
const FadeInImage = ({ className = '', ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      {...props}
      onLoad={() => setLoaded(true)}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

// Matches Tailwind's md / lg / xl breakpoints.
const columnsForWidth = (width: number) => (width >= 1280 ? 4 : width >= 1024 ? 3 : width >= 768 ? 2 : 1);

const useColumnCount = () => {
  const [count, setCount] = useState(() => columnsForWidth(window.innerWidth));

  useEffect(() => {
    const onResize = () => setCount(columnsForWidth(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return count;
};

const Photography = () => {
  const posthog = usePostHog();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [fullImageLoaded, setFullImageLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const columnCount = useColumnCount();

  useEffect(() => {
    setLoaded(true);
    document.title = "Photography Portfolio | Yash Thapliyal";

    const photoModules = import.meta.glob('/public/Portfolio-Photos-WebP/*.webp', {
      eager: true,
      as: 'url'
    });

    const thumbnailModules = import.meta.glob('/public/Portfolio-Photos-Thumbnails/*.webp', {
      eager: true,
      as: 'url'
    });

    const stripPublic = (u: string) => u.replace(/^\/public\//, '/');

    const photoList: Photo[] = Object.entries(photoModules).map(([path, url], index) => {
      const filename = path.split('/').pop()?.split('.')[0] || '';
      const thumbnailKey = Object.keys(thumbnailModules).find(thumbPath =>
        thumbPath.includes(`${filename}-thumb.webp`)
      );
      const thumbnailUrl = thumbnailKey ? stripPublic(thumbnailModules[thumbnailKey] as string) : stripPublic(url as string);

      return {
        id: index + 1,
        imageUrl: stripPublic(url as string),
        thumbnailUrl: stripPublic(thumbnailUrl),
        filename,
      };
    });

    // Curated order from src/data/photo-order.json; photos not listed there go last.
    const rank = new Map((photoOrder as string[]).map((name, i) => [name, i]));
    photoList.sort((a, b) => (rank.get(a.filename) ?? rank.size) - (rank.get(b.filename) ?? rank.size));

    setPhotos(photoList);
  }, []);

  // Dev server only: drag to reorder, hover to move to top or remove.
  const devLayout = useDevPhotoLayout(photos);

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    setFullImageLoaded(false);
    document.body.style.overflow = 'hidden';
    analytics.trackPhotoModalOpen(photo.filename);
    posthog?.capture('photo_modal_opened', { photo_filename: photo.filename });
  };

  const selectedDimensions = selectedPhoto ? dimensionsOf(selectedPhoto.filename) : undefined;

  const closeModal = () => {
    setSelectedPhoto(null);
    setFullImageLoaded(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Head
        title="Photography | Yash Thapliyal"
        description="Photography portfolio by Yash Thapliyal - capturing moments through the lens."
      />
      <Navigation />

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <h1 className={`font-mono text-5xl md:text-7xl font-black mb-8 tracking-tight transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-4 rounded-2xl shadow-2xl inline-block transform hover:scale-105 transition-transform duration-300">
              Photography
            </span>
          </h1>
          <p className={`font-mono text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

        {/* Masonry Photo Grid: photos are dealt into columns left to right, so the first ones form the top row */}
        <div className={`flex items-start gap-6 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {Array.from({ length: columnCount }, (_, column) => (
            <div key={column} className="flex min-w-0 flex-1 flex-col gap-6">
              {devLayout.shown.filter((_, i) => i % columnCount === column).map((photo) => (
                <div
                  key={photo.id}
                  className="group cursor-pointer"
                  onClick={() => openModal(photo)}
                  {...devLayout.tileProps(photo)}
                >
                  <div
                    className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    style={{ backgroundColor: dimensionsOf(photo.filename)?.color }}
                  >
                    {/* width/height reserve the tile's shape before the image arrives */}
                    <FadeInImage
                      src={photo.thumbnailUrl}
                      alt={`Photography by Yash Thapliyal - ${photo.filename}`}
                      width={dimensionsOf(photo.filename)?.width}
                      height={dimensionsOf(photo.filename)?.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-mono text-sm font-medium">
                        {photo.filename.replace(/[-_]/g, ' ')}
                      </div>
                    </div>
                    {devLayout.tileControls(photo)}
                  </div>
                </div>
              ))}
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
          <button
            onClick={closeModal}
            className="fixed top-6 right-6 font-mono text-white hover:text-gray-300 text-xl font-bold z-10 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl transition-colors duration-300"
          >
            CLOSE ×
          </button>

          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={lightboxStyle(selectedDimensions)}
            onClick={(e) => e.stopPropagation()}
          >
            {/* The thumbnail is already loaded: show it straight away, then sharpen to the full photo */}
            {selectedDimensions && (
              <img src={selectedPhoto.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-contain" />
            )}

            <img
              src={selectedPhoto.imageUrl}
              alt={`Photography by Yash Thapliyal - ${selectedPhoto.filename}`}
              className={`relative block object-contain transition-opacity duration-300 ${
                selectedDimensions ? 'h-full w-full' : 'max-w-[calc(100vw-3rem)] max-h-[calc(100vh-9rem)]'
              } ${fullImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setFullImageLoaded(true)}
            />

            <div className="absolute bottom-6 left-6 font-mono text-white text-lg bg-black/70 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold">
              {selectedPhoto.filename.replace(/[-_]/g, ' ')}
            </div>
          </div>
        </div>
      )}

      {devLayout.toolbar}
    </div>
  );
};

export default Photography; 