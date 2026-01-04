import apiClient from './axiosConfig.js'

/**
 * Payment API service
 * Handles Stripe payment related API calls
 */

/**
 * Create Stripe checkout session
 * @param {string} serviceOption - 'analysis', 'improved', or 'complete'
 * @param {string} customerEmail - Customer email address
 * @param {Object} metadata - Additional metadata
 * @param {boolean} embedded - Whether to create embedded checkout (default: true)
 * @returns {Promise<Object>} Checkout session data
 */
export const createCheckoutSession = async (serviceOption, customerEmail, metadata = {}, embedded = true) => {
	if (!serviceOption) {
		throw new Error('Service option is required')
	}

	if (!customerEmail) {
		throw new Error('Customer email is required')
	}

	const response = await apiClient.post('/api/create-checkout-session', {
		serviceOption,
		customerEmail,
		metadata,
		embedded
	})

	return response.data
}

/**
 * Verify payment session
 * @param {string} sessionId - Stripe session ID
 * @returns {Promise<Object>} Session verification result
 */
export const verifySession = async (sessionId) => {
	if (!sessionId) {
		throw new Error('Session ID is required')
	}

	const response = await apiClient.post('/api/verify-session', {
		sessionId
	})

	return response.data
}

