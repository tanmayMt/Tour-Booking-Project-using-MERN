import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tour-booking-api.onrender.com',
  withCredentials: true,
});

export default API;