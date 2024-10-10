import axios from 'axios';

const useEndpoint = true;

const endpoint = 'http://site-vw.ncl.intranet/orders-voa/api/errors';

const baseURL = useEndpoint ? endpoint : 'http://localhost:3001/data';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
