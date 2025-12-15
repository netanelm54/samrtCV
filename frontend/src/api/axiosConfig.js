import axios from 'axios'

/**
 * Axios instance configuration
 * Centralized configuration for all API requests
 */
const apiClient = axios.create({
	baseURL: '',
	timeout: 300000, // 5 minutes for file uploads
	headers: {
		'Content-Type': 'multipart/form-data'
	}
})

/**
 * Request interceptor
 * Add any request-level logic here (auth tokens, etc.)
 */
apiClient.interceptors.request.use(
	(config) => {
		// Add auth token if needed
		// const token = localStorage.getItem('token')
		// if (token) {
		//   config.headers.Authorization = `Bearer ${token}`
		// }
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

/**
 * Response interceptor
 * Handle common response logic and errors
 */
apiClient.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		// Handle common errors
		if (error.response) {
			// Server responded with error status
			const status = error.response.status

			switch (status) {
				case 400:
					error.message = error.response.data?.error || 'Bad request. Please check your input.'
					break
				case 401:
					error.message = 'Unauthorized. Please log in.'
					break
				case 403:
					error.message = 'Forbidden. You do not have permission.'
					break
				case 404:
					error.message = 'Resource not found.'
					break
				case 413:
					error.message = 'File too large. Please upload a smaller file.'
					break
				case 500:
					error.message = 'Server error. Please try again later.'
					break
				case 503:
					error.message = 'Service unavailable. Please try again later.'
					break
				default:
					error.message = error.response.data?.error || 'An error occurred.'
			}
		} else if (error.request) {
			// Request was made but no response received
			error.message = 'Network error. Please check your connection.'
		} else {
			// Something else happened
			error.message = error.message || 'An unexpected error occurred.'
		}

		return Promise.reject(error)
	}
)

export default apiClient

