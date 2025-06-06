import { CalendarDays } from 'lucide-react';
import EventsList from '../events/EventList';

const UpcomingEvents = () => {
    return (
        <div className="bg-white mx-4 rounded-lg border border-gray-300 shadow-sm h-full flex flex-col">
            <div className="px-4 py-3 border-b border-gray-300">
                <h2 className="font-semibold text-primary flex items-center text-xl">
                    <CalendarDays className="w-5 h-5 mx-2 text-primary" />
                    الأحداث القادمة
                </h2>
            </div>
            <EventsList />
        </div>
    );
};

export default UpcomingEvents;