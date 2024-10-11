import axios from 'axios';

const endpoints = {
  protheus: 'http://site-vw.ncl.intranet/orders-voa/api/errors',
  occ: 'http://site-vw.ncl.intranet/orders-voa/api/errors',
};

function getEndpoint(errorType: string) {
  return axios.create({
    baseURL:
      endpoints[errorType as keyof typeof endpoints] ||
      Object.values(endpoints)[0],
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default getEndpoint;
