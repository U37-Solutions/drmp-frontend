const normalizeEnvValue = (value?: string) => {
  if (!value) return undefined;
  const normalized = value.trim();
  if (!normalized || normalized === 'undefined' || normalized === 'null') {
    return undefined;
  }
  return normalized;
};

export const environments = {
  clientUrl: normalizeEnvValue(process.env.NEXT_PUBLIC_URL) ?? '',
  apiUrl: normalizeEnvValue(process.env.NEXT_PUBLIC_API_URL) ?? '',
  wsUrl: normalizeEnvValue(process.env.NEXT_PUBLIC_WS_URL) ?? '',
  mapApiKey: normalizeEnvValue(process.env.NEXT_PUBLIC_MAP_API_KEY) ?? '',
  mtMapApiKey: normalizeEnvValue(process.env.NEXT_PUBLIC_MT_MAP_API_KEY) ?? '',
  lightMapId: normalizeEnvValue(process.env.NEXT_PUBLIC_LIGHT_MAP_ID),
  darkMapId: normalizeEnvValue(process.env.NEXT_PUBLIC_DARK_MAP_ID),
};
