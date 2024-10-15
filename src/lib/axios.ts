import axios from 'axios';

// const baseUrl = 'http://localhost:3001';
const baseUrl = new URL(import.meta.env.VITE_API_BASE_URL!);

const endpointsGET = {
  base: baseUrl.href,
  protheus: new URL('protheus', baseUrl).href,
  occ: new URL('voa', baseUrl).href,
  history: new URL('log', baseUrl).href,
};

function getEndpoint(errorType: string) {
  return axios.create({
    baseURL: endpointsGET[errorType as keyof typeof endpointsGET],
    timeout: 2000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default getEndpoint;
