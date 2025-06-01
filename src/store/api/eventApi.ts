import type { Pagination } from '../../types/album';
import type { IEvent } from '../../types/event';
import { baseApi } from './baseApi';

export const eventApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all events with pagination
        getEvents: build.query<{ data: IEvent[]; pagination: Pagination }, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/event?page=${page}&limit=${limit}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Events' as const, id: _id })),
                        { type: 'Events' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Events' as const, id: 'LIST' }],
        }),

        // Get single event by ID
        getEvent: build.query<IEvent, string>({
            query: (id) => ({
                url: `/event/${id}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (_result, _error, id) => [{ type: 'Events' as const, id }],
        }),

        // Create new event
        createEvent: build.mutation<IEvent, {
            address: string;
            description: string;
            location: string;
            startDate: Date | string;
            endDate?: Date | string;
        }>({
            query: (eventData) => ({
                url: '/event',
                method: 'POST',
                body: eventData,
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'Events' as const, id: 'LIST' }],
        }),

        // Update event
        updateEvent: build.mutation<IEvent, { id: string; updates: Partial<IEvent> }>({
            query: ({ id, updates }) => ({
                url: `/event/${id}`,
                method: 'PATCH',
                body: updates,
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Events' as const, id },
                { type: 'Events' as const, id: 'LIST' },
            ],
        }),

        // Delete event
        deleteEvent: build.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/event/${id}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Events' as const, id },
                { type: 'Events' as const, id: 'LIST' },
            ],
        }),

        // Register user to event
        registerToEvent: build.mutation<IEvent, { eventId: string }>({
            query: ({ eventId }) => ({
                url: `/event/${eventId}/register`,
                method: 'POST',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { eventId }) => [
                { type: 'Events' as const, id: eventId },
            ],
        }),

        // Unregister user from event
        unregisterFromEvent: build.mutation<IEvent, { eventId: string }>({
            query: ({ eventId }) => ({
                url: `/event/${eventId}/unregister`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { eventId }) => [
                { type: 'Events' as const, id: eventId },
            ],
        }),
    }),
});

export const {
    useGetEventsQuery,
    useGetEventQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useRegisterToEventMutation,
    useUnregisterFromEventMutation,
} = eventApi;