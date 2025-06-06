import { useGetEventsQuery } from "../../../../store/api/eventApi";
import EventCard from "./EventCard";

const EventsList = () => {
  const { data: apiResponse = { data: [], pagination: {} } } = useGetEventsQuery({});
  const events = apiResponse.data;

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 px-6 py-8">
      {events.map(event => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default EventsList;