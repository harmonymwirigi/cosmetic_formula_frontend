// frontend/src/services/errorHandler.js
export const handleApiError = (error) => {
    // Log the error for debugging
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      
      // Return the error data from the server if available
      return Promise.reject(error.response.data || {
        message: `Error ${error.response.status}: ${error.response.statusText}`
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({
        message: 'No response received from server. Please check your connection.'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject({
        message: 'Error setting up the request: ' + error.message
      });
    }
  };
  
  export default {
    handleApiError
  };