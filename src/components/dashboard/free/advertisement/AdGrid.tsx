import type { IAdvertisement } from "../../../../types/advertisement";
import AdCard from "./AdCard";

interface IAdGrid{
    ads:IAdvertisement[];
    currentIndex: any;
}

const AdGrid = ({ ads, currentIndex }:IAdGrid) => {
  const visibleAds = [
    ads[(currentIndex - 1 + ads.length) % ads.length],
    ads[currentIndex],
    ads[(currentIndex + 1) % ads.length]
  ];

  return (
    <div className="flex h-full transition-all duration-500 gap-3" >
      {/* Right Ad (small) */}
      <div className="hidden md:block w-1/4 h-full shrink-0 px-2">
        <AdCard ad={visibleAds[0]} size="small" />
      </div>
      
      {/* Center Ad (large) */}
      <div className="md:w-2/4 w-full h-full shrink-0 px-2">
        <AdCard ad={visibleAds[1]} size="large" />
      </div>
      
      {/* Left Ad (small) */}
      <div className="hidden md:block w-1/4 h-full shrink-0 px-2">
        <AdCard ad={visibleAds[2]} size="small" />
      </div>
    </div>
  );
};

export default AdGrid;