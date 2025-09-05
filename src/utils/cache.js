export const getCachedData = (cacheKey, maxAgeMs) => {
  const timestampKey = `${cacheKey}_timestamp`;
  const cachedTimestamp = localStorage.getItem(timestampKey);
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedTimestamp && cachedData && (Date.now() - parseInt(cachedTimestamp, 10) < maxAgeMs)) {
    console.log(`Loading ${cacheKey} from cache.`);
    try {
      const parsedData = JSON.parse(cachedData);
      return parsedData;
    } catch (e) {
      console.error(`Error parsing cached data for ${cacheKey}:`, e);
      return null;
    }
  }
  console.log(`Cache miss or expired for ${cacheKey}.`);
  return null;
};

export const setCachedData = (cacheKey, data) => {
  const timestampKey = `${cacheKey}_timestamp`;
  try {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(cacheKey, stringifiedData);
    localStorage.setItem(timestampKey, Date.now().toString());
    console.log(`Cached data for ${cacheKey}.`);
  } catch (e) {
    console.error(`Error caching data for ${cacheKey}:`, e);
  }
};
