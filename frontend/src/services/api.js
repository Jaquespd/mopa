import axios from 'axios';

const api = axios.create({
  // Development
  baseURL: 'http://localhost:3333',
  // Production
  // baseURL: 'http://178.128.153.78',
});

export default api;
