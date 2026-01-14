import axios from 'axios';

class Network {
  /**
   * GET request
   */
  static async get(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request (for creating resources)
   */
  static async store(url, data) {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT/PATCH request (for updating resources)
   */
  static async update(url, data) {
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  static async delete(url) {
    try {
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request for search functionality
   */
  static async search(url, data) {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Centralized error handling
   */
  static handleError(error) {
    console.error('Network Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      
      // Laravel validation errors
      if (error.response.data.error) {
        return { error: error.response.data.error };
      }
      
      // General error message
      if (error.response.data.error_message) {
        return { error_message: error.response.data.error_message };
      }
      
      // Other error formats
      return { 
        error_message: error.response.data.message || 'An error occurred on the server' 
      };
      
    } else if (error.request) {
      // The request was made but no response was received
      return { 
        error_message: 'No response from server. Please check your internet connection.' 
      };
      
    } else {
      // Something happened in setting up the request that triggered an Error
      return { 
        error_message: error.message || 'An unexpected error occurred' 
      };
    }
  }
}

export default Network;