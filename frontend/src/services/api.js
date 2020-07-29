import axios from 'axios';

const api = axios.create({
  // Development
  // baseURL: 'http://localhost:3333',
  // Production
  // baseURL: 'https://178.128.153.78:3333',
  baseURL: 'https://api.mopa.natalprojetos.com.br',
});

export default api;
