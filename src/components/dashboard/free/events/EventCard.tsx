import { useState } from 'react';
import type { IEvent } from '../../../../types/event';

interface IEventCard{
    event:IEvent
}

const EventCard = ({ event }:IEventCard) => {
  const [isExpanded] = useState(false);

  const formatArabicDate = (dateString:any) => {
    const date = new Date(dateString);
    const options:any = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ar-EG', options);
  };

  const formatTime = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className="p-6 flex items-center border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Date Box */}
      <div className="ml-4 bg-primary p-3 rounded-lg text-center min-w-[70px]">
        <p className="text-2xl font-bold text-white">
          {new Date(event.startDate).getDate()}
        </p>
        <p className="text-xs text-white">
          {new Date(event.startDate).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* event Details */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-primary"> {event.address} </h3>
            <p className="text-gray-500 text-sm mt-1">
              من {formatTime(event.startDate)} إلى {formatTime(event.endDate)}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-gray-600">{event.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium">العنوان:</span> {event.location}
          </p>
        </div>

        {/* Expandable Section */}
        {event.createdAt && event.updatedAt && isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="font-medium">تاريخ الإنشاء:</span> {formatArabicDate(event.createdAt)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">آخر تحديث:</span> {formatArabicDate(event.updatedAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;