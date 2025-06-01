import { useState, useEffect } from 'react';
import { useGetEventsQuery } from '../../../../store/api/eventApi';
import { isAfter } from 'date-fns';
import type { IEvent } from '../../../../types/event';

const UpcomingEvents = () => {
    const { data: apiResponse = { data: [], pagination: {} }, isLoading } = useGetEventsQuery({});
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
    let events = apiResponse.data;
    useEffect(() => {
        // تصفية الأحداث القادمة فقط
        const filteredEvents = events
            .filter((event: IEvent) => isAfter(new Date(event.startDate), new Date()))
            .sort((a: IEvent, b: IEvent) =>
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 5); // الحد الأقصى 5 أحداث

        setUpcomingEvents(filteredEvents);
    }, [events]);

    // التبديل التلقائي بين الأحداث
    useEffect(() => {
        if (upcomingEvents.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % upcomingEvents.length);
            }, 5000); // تغيير كل 5 ثواني
            return () => clearInterval(interval);
        }
    }, [upcomingEvents]);

    const formatToArabic = (date: Date) => {
        return new Intl.DateTimeFormat('ar-EG', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date).replace('AM', 'ص').replace('PM', 'م');
    };

    if (isLoading) return <div className="text-center py-4">جاري التحميل...</div>;
    if (upcomingEvents.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-primary-600">الأحداث القادمة</h2>

            <div className="relative h-64 overflow-hidden">
                {upcomingEvents.map((event: IEvent, index: number) => (
                    <div
                        key={event._id}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                    >
                        <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800">{event.description}</h3>
                            <p className="text-gray-600 mt-2">{event.location}</p>

                            <div className="mt-auto">
                                <p className="text-sm text-gray-500">
                                    {formatToArabic(new Date(event.startDate))}
                                </p>
                                {event.endDate && (
                                    <p className="text-sm text-gray-500">
                                        حتى {formatToArabic(new Date(event.endDate))}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* نقاط التنقل */}
            {upcomingEvents.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    {upcomingEvents.map((_, index: number) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                                }`}
                            aria-label={`انتقل إلى الحدث ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* أزرار التنقل */}
            {upcomingEvents.length > 1 && (
                <div className="flex justify-between mt-4">
                    <button
                        onClick={() =>
                            setCurrentIndex(prev =>
                                (prev - 1 + upcomingEvents.length) % upcomingEvents.length
                            )
                        }
                        className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        السابق
                    </button>
                    <button
                        onClick={() =>
                            setCurrentIndex(prev => (prev + 1) % upcomingEvents.length)
                        }
                        className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        التالي
                    </button>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;