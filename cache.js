// Cache for satellite data


const Cache = {
    set(key, value, ttl = 21600) {
      const data = {
        value,
        expires: ttl ? Date.now() + ttl * 1000 : null, 
      };
      localStorage.setItem(key, JSON.stringify(data));
    },

    get(key) {
      const rawData = localStorage.getItem(key);
      if (!rawData) return null;
  
      try {
        const data = JSON.parse(rawData);
        if (data.expires && Date.now() > data.expires) {
          localStorage.removeItem(key); 
          return null;
        }
        return data.value;
      } catch (error) {
        console.error('Failed to parse cached data:', error);
        return null;
      }
    },
  
    remove(key) {
      localStorage.removeItem(key);
    },
  
    clear() {
      localStorage.clear();
    },
  
    has(key) {
      return this.get(key) !== null;
    },
};
  
export default Cache;
  