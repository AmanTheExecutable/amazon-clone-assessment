import axios from 'axios';

const api = axios.create({ baseURL: 'https://dummyjson.com' });

export const fetchProducts = (limit = 100, skip = 0) => api.get(`/products?limit=${limit}&skip=${skip}`);
export const fetchCategories = () => api.get('/products/categories');
export const fetchByCategory = (category) => api.get(`/products/category/${category}?limit=100`);
export const fetchProductById = (id) => api.get(`/products/${id}`);
