import type { IAdvertisement } from '../../types/advertisement';
import type { Album } from '../../types/album';
import type { IEvent } from '../../types/event';
import { baseApi } from './baseApi';

export const chartsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAlbumStats: build.query<{
            success: boolean;
            data: {
                counts: {
                    totalAlbums: number;
                    totalImages: number;
                    newAlbums: number;
                };
                recentAlbums: Album[];
                timeframe: string;
            };
            message: string;
        }, { days?: number }>({
            query: ({ days } = { days: 7 }) => ({
                url: '/album/stats',
                method: 'GET',
                params: { days },
                credentials: 'include'
            }),
            providesTags: ['ChartsStats']
        }),

        getEventOverview: build.query<{
            success: boolean;
            data: {
                counts: {
                    total: number;
                    ended: number;
                    upcoming: number;
                };
                nextEvent: IEvent | null;
                asOf: string;
            };
            message: string;
        }, void>({
            query: () => ({
                url: '/event/stats',
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: ['ChartsStats']
        }),

        getUsersStats: build.query<{
            success: boolean;
            data: {
                totalUsers: number;
                newUsers: number;
                newUsersTimeframe: string;
            };
            message: string;
        }, void>({
            query: () => ({
                url: '/user/stats',
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: ['ChartsStats']
        }),

        getAdvertisementStats: build.query<{
            success: boolean;
            data: {
                totalAdvertisements: number;
                newAdvertisementsLast7Days: IAdvertisement[],
                newAdvertisements: IAdvertisement[],
            };
            message: string;
        }, void>({
            query: () => ({
                url: '/advertisement/stats',
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: ['ChartsStats']
        }),
    }),
});

export const {
    useGetAlbumStatsQuery,
    useGetEventOverviewQuery,
    useGetUsersStatsQuery,
    useGetAdvertisementStatsQuery,
} = chartsApi;