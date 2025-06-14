import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdGrid from '../advertisement/AdGrid';
import type { IAdvertisement } from '../../../../types/advertisement';

interface IAdCarousel{
    ads:IAdvertisement[];
}

const AdCarousel = ({ ads }:IAdCarousel) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  if (!acceptedAds || acceptedAds.length === 0) {
    return <div className="text-center py-10">لا توجد إعلانات متاحة</div>;
  }

  return (
    <div className="w-full max-w-full px-3 lg:w-11/12 mx-auto">
      <div className="relative w-full h-96 overflow-hidden rounded-2xl">
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
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {acceptedAds.map((_: any, index:number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              aria-label={`Go to ad ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdCarousel;