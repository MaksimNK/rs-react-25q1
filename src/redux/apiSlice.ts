import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import ENDPOINTS from '../utils/endpoint';
import { IItem } from '../types/item';
import { API_BASE } from '../utils/endpoint';

export interface IApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IItem[];
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE}` }),
  endpoints: (builder) => ({
    fetchData: builder.query<
      IApiResponse,
      { category: string; searchTerm: string; page?: number }
    >({
      query: ({ category, searchTerm, page = 1 }) => {
        const url = ENDPOINTS[category];
        if (!url) {
          throw new Error(`No endpoint found for category: ${category}`);
        }
        let fullUrl = url;
        if (searchTerm) {
          fullUrl += `?search=${encodeURIComponent(searchTerm)}&page=${page}`;
        } else {
          fullUrl += `?page=${page}`;
        }
        return fullUrl;
      },
    }),
    fetchSinglePerson: builder.query<IItem, { id: string; category: string }>({
      query: ({ id, category }) => {
        const baseUrl = ENDPOINTS[category];
        if (!baseUrl) {
          throw new Error('No endpoint found for people');
        }
        return `${baseUrl}${id}/`;
      },
    }),
  }),
});

export const { useFetchDataQuery, useFetchSinglePersonQuery } = api;
