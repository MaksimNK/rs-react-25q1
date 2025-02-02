const API_BASE = 'https://swapi.dev/api/';

const ENDPOINTS: Record<string, string> = {
  people: `${API_BASE}people/`,
  planets: `${API_BASE}planets/`,
  films: `${API_BASE}films/`,
  species: `${API_BASE}species/`,
  vehicles: `${API_BASE}vehicles/`,
  starships: `${API_BASE}starships/`,
};
export default ENDPOINTS;
