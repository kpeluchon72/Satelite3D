import Cache from './cache.js';
import { TTL_SATELLITE_DATA } from './constants.js';


// Api call for data / cache call
export async function fetchActiveSatellites() {
    // key in cache for active satellites data = apiUrl
    const apiUrl = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle';

    const cachedData = Cache.get(apiUrl);
    if (cachedData) {
      console.log('Using cached data:', cachedData);
      return cachedData;
    }


    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error status: ${response.status}`);
      }
      
      const data = await response.text();
      
      // strip TLE data
      const lines = data.split('\n');
      const satellites = [];
      for (let i = 0; i < lines.length; i += 3) {
        const name = lines[i]?.trim();
        const line1 = lines[i + 1]?.trim();
        const line2 = lines[i + 2]?.trim();
  
        if (name && line1 && line2) {
          satellites.push({ name, line1, line2 });
        }
      }

      Cache.set(apiUrl, satellites, TTL_SATELLITE_DATA); // 6 hours TTL
      console.log('Fetched from API and cached:', satellites);

      return satellites;

    } catch (error) {
      console.error('Error fetching satellites:', error);
    }
  }

  
