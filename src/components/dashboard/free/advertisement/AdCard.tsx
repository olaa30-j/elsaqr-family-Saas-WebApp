import { AlertOctagon, BellRingIcon, Lightbulb, Trophy } from 'lucide-react';
import type { IAdvertisement } from '../../../../types/advertisement';

interface IAdsCard{
    ad:IAdvertisement;
    size: string;
}

const AdCard = ({ ad, size = 'small' }:IAdsCard) => {
  const getIcon = () => {
    switch (ad.type) {
      case 'photography':
        return <AlertOctagon className="text-primary" />;
      case 'idea':
        return <Lightbulb className="text-primary" />;
      case 'achievement':
        return <Trophy className="text-primary" />;
      default:
        return <BellRingIcon className="text-primary" />;
    }
  };

  if (size === 'large') {
    return (
      <div className="w-full h-full relative scale-105 z-8 shadow-lg transition-all duration-300 hover:scale-100">
        {ad.image && (
          <img 
            className="object-cover h-full w-full rounded-lg" 
            src={ad.image} 
            alt={ad.title} 
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-black bg-opacity-50 text-white rounded-b-lg">
          <div className="w-10 h-10 mb-3 flex items-center justify-center bg-white rounded-lg">
            {getIcon()}
          </div>
          <h5 className="text-lg font-bold text-primary text-right">{ad.title}</h5>
          <p className="text-sm opacity-80 text-right mt-2">{ad.content}</p>
          <div className="text-md text-left mt-3 opacity-70">
            {new Date(ad.createdAt).toLocaleDateString('ar-EG')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative transition-all duration-300 hover:scale-95">
      {ad.image && (
        <img 
          className="object-cover h-full w-full rounded-lg" 
          src={ad.image || ''} 
          alt={ad.title} 
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white rounded-b-lg">
        <div className="w-8 h-8 mb-2 flex items-center justify-center bg-white rounded-lg">
          {getIcon()}
        </div>
        <h5 className="text-sm font-medium text-right">{ad.title}</h5>
      </div>
    </div>
  );
};

export default AdCard;