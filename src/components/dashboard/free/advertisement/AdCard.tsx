import { BellRingIcon } from 'lucide-react';
import type { IAdvertisement } from '../../../../types/advertisement';
import { Link } from 'react-router-dom';
import RichTextRenderer from '../../../shared/RichTextRenderer';

interface IAdsCard {
  ad: IAdvertisement;
  size: string;
}

const AdCard = ({ ad, size = 'small' }: IAdsCard) => {

  if (size === 'large') {
    return (
      <Link to={`/advertisement-details/${ad._id}`} className="block w-full h-full relative z-[10]">
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
              <BellRingIcon className="text-primary" />
            </div>
            <h5 className="text-lg font-bold text-white text-right">{ad.title}</h5>
            <p className="text-sm opacity-80 text-right mt-2">
              <RichTextRenderer content={ad.content} />
            </p>
            <div className="text-md text-left mt-3 opacity-70">
              {new Date(ad.createdAt).toLocaleDateString('ar-EG')}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`advertisement-details/${ad._id}`}>

      <div className="w-full h-full relative transition-all duration-300 hover:scale-95">
        {ad.image && (
          <img
            className="object-cover h-full w-full rounded-lg"
            src={ad.image || ''}
            alt={ad.title}
          />
        )}
        <div className="absolute bottom-0 h-full left-0 right-0 p-4 bg-black bg-opacity-50 text-white rounded-b-lg">
        </div>
        <div className='absolute bottom-0 left-0 right-0 z-5 text-white rounded-b-lg p-4'>
          <div className="w-10 h-10 mb-3 flex items-center justify-center bg-white rounded-lg">
            <BellRingIcon className="text-primary" />
          </div>
          <h5 className="text-sm font-medium text-right">{ad.title}</h5>
          <div className='flex gap-2 mt-3 items-center'>
            {/* <img src={ad.userId.createdAt.memberId.image} alt="مدير الاعلانات" className='w-8 h-8 rounded-md' /> */}
            {/* <h4 className=''>{ad.userId.fname} {ad.userId.lname}</h4> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AdCard;