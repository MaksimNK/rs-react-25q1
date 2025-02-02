import ENDPOINTS from './endpoint';

export interface IItem {
  name: string;
  model?: string;
  url: string;
}

export const fetchData = async (
  category: string,
  searchTerm: string
): Promise<IItem[]> => {
  const url = ENDPOINTS[category];

  if (!url) {
    console.error('Error, category not found');
    return [];
  }

  try {
    let fullUrl = url;
    if (searchTerm) {
      fullUrl += `?search=${searchTerm}`;
    }

    const response = await fetch(fullUrl);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Fetch Error:', error);
    return [];
  }
};
