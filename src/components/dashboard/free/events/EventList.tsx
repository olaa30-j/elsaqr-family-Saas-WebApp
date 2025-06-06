import { useGetEventsQuery } from "../../../../store/api/eventApi";
import EventCard from "./EventCard";

const EventsList = () => {
  const { data: apiResponse = { data: [], pagination: {} } } = useGetEventsQuery({});
  const events = apiResponse.data;

  return (
    <div className="overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-6 w-max mt-2 px-4">
        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsList;