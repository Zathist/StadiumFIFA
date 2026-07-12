// FIFA World Cup 2026 host stadiums located in the US (NWS/api.weather.gov
// only covers US territory - Canada/Mexico venues are explicitly out of
// scope for this evidence source, which we surface honestly rather than
// silently failing or faking coverage).

export type HostCity = {
  name: string;
  lat: number;
  lon: number;
};

export const US_HOST_CITIES: HostCity[] = [
  { name: "Los Angeles", lat: 34.0141, lon: -118.2879 },
  { name: "San Francisco Bay Area", lat: 37.4032, lon: -121.9694 },
  { name: "Seattle", lat: 47.5952, lon: -122.3316 },
  { name: "Kansas City", lat: 39.0489, lon: -94.4839 },
  { name: "Dallas", lat: 32.7473, lon: -97.0945 },
  { name: "Houston", lat: 29.6847, lon: -95.4107 },
  { name: "Atlanta", lat: 33.7554, lon: -84.4008 },
  { name: "Miami", lat: 25.9580, lon: -80.2389 },
  { name: "New York / New Jersey", lat: 40.8135, lon: -74.0745 },
  { name: "Philadelphia", lat: 39.9008, lon: -75.1675 },
  { name: "Boston", lat: 42.0909, lon: -71.2643 },
];

export function findHostCity(name: string): HostCity | undefined {
  const normalized = name.trim().toLowerCase();
  return US_HOST_CITIES.find(
    (c) => c.name.toLowerCase().includes(normalized) || normalized.includes(c.name.toLowerCase())
  );
}
