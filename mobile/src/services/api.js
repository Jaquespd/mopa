import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.99.1:3333',
  // baseURL: 'http://localhost:3333',
  // baseURL: 'api.mopa.natalprojetos.com.br',
});

export default api;
