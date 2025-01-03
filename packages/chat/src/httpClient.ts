// Import axios
import axios from 'axios';

// Define the HttpClient module
export const HttpClient = {
  // Base configuration for axios
  axiosInstance: axios.create({
    baseURL: '', // Set your base URL here if needed
    timeout: 10000, // Set timeout for requests
    headers: {
      'Content-Type': 'application/json',
    },
  }),

  // GET request
  async Get(url, params = {}, config = {}) {
    try {
      const response = await this.axiosInstance.get(url, {
        ...config,
        params,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  // POST request
  async Post(url, data = {}, config = {}) {
    try {
      const response = await this.axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  // Error handling utility
  handleError(error) {
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('General error:', error.message);
    }
  },
};

// Example usage
// import HttpClient from './HttpClient';
// const requestUrl = 'https://api.example.com/resource';
// const params = { key: 'value' };
// const response = await HttpClient.Post(requestUrl, params);
