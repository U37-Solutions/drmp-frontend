import axios from 'axios';

import { environments } from '../configs/environments';

const apiClient = axios.create({
  baseURL: environments.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default apiClient;
