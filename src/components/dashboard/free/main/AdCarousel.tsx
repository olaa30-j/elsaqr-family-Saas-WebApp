import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AdGrid from '../advertisement/AdGrid';
import type { IAdvertisement } from '../../../../types/advertisement';

interface IAdCarousel {
  ads: IAdvertisement[];
}

const AdCarousel = ({ ads }: IAdCarousel) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const acceptedAds = ads.filter(ad => ad.status === "accept");

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? acceptedAds.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === acceptedAds.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSwiping || startX === null) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diffX = clientX - startX;

    if (Math.abs(diffX) > 5 && e.cancelable) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === null) return;

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diffX = clientX - startX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPrev();  
      } else {
        goToNext(); 
      }
    }

    setStartX(null);
    setIsSwiping(false);
  };

  if (!acceptedAds || acceptedAds.length === 0) {
    return <div className="text-center py-10">لا توجد إعلانات متاحة</div>;
  }

  return (
    <div className="w-full max-w-full px-3 lg:w-11/12 mx-auto relative">
      <div
        ref={carouselRef}
        className="relative w-full h-96 overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => {
          if (isSwiping) {
            setStartX(null);
            setIsSwiping(false);
          }
        }}
      >
        <AdGrid ads={acceptedAds} currentIndex={currentIndex} />

        {/* Navigation Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button
            onClick={goToPrev}
            className="z-6 w-10 h-10 p-2 text-white bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="z-6 w-10 h-10 p-2 text-white bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-70"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2 z-10">
        {acceptedAds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-6'
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Go to ad ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdCarousel;