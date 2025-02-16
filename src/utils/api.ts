import ENDPOINTS from './endpoint';

export interface IItem {
  name: string;
  model?: string;
  url: string;
}

export interface IApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IItem[];
}

export const fetchData = async (
  category: string,
  searchTerm: string,
  page: number = 1
): Promise<IApiResponse> => {
  const url = ENDPOINTS[category];
  if (!url) {
    return { count: 0, next: null, previous: null, results: [] };
  }

  try {
    let fullUrl = url;
    if (searchTerm) {
      fullUrl += `?search=${encodeURIComponent(searchTerm)}&page=${page}`;
    } else {
      fullUrl += `?page=${page}`;
    }

    const response = await fetch(fullUrl);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const fetchSinglePerson = async (id: string): Promise<IItem | null> => {
  const baseUrl = ENDPOINTS['people'];
  if (!baseUrl) {
    return null;
  }
  try {
    const fullUrl = `${baseUrl}${id}/`;
    const response = await fetch(fullUrl);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
