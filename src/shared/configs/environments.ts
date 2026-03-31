export const environments = {
  clientUrl: `${process.env.NEXT_PUBLIC_URL}`,
  apiUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  wsUrl: `${process.env.NEXT_PUBLIC_WS_URL}`,
  geocoderApiUrl: `${process.env.NEXT_PUBLIC_GEOCODER_API_URL || '/api/geocoder'}`,
  lightTileUrl: `${process.env.NEXT_PUBLIC_LIGHT_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}`,
  darkTileUrl: `${process.env.NEXT_PUBLIC_DARK_TILE_URL || 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}`,
  lightTileAttribution: `${process.env.NEXT_PUBLIC_LIGHT_TILE_ATTRIBUTION || '&copy; OpenStreetMap contributors'}`,
  darkTileAttribution: `${process.env.NEXT_PUBLIC_DARK_TILE_ATTRIBUTION || '&copy; OpenStreetMap contributors &copy; CARTO'}`,
};
