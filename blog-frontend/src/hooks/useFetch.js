import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(url, method = 'GET', body = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto fetch only for GET
  useEffect(() => {
    if (method === 'GET') {
      execute();
    }
  }, [url]);

  const execute = async (payload = body) => {
    setLoading(true);
    setError(null);
    try {
      const config = { method, url };
      if (payload) config.data = payload;
      const res = await axios(config);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}

export default useFetch;