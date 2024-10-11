import axios from 'axios';

const baseUrl = 'http://site-vw.ncl.intranet/orders-voa/api';

const endpointsGET = {
  protheus: baseUrl + '/errors',
  occ: baseUrl + '/errors/import',
  history: baseUrl + '/errors',
};

function getEndpoint(errorType: string) {
  return axios.create({
    baseURL:
      endpointsGET[errorType as keyof typeof endpointsGET] ||
      Object.values(endpointsGET)[0],
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default getEndpoint;
