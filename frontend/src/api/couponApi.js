import apiClient from './axiosConfig.js'

/**
 * API service for coupon code validation
 */

/**
 * Validates a coupon code
 * @param {string} couponCode - The coupon code to validate
 * @returns {Promise<{valid: boolean, message?: string, error?: string}>}
 */
export const validateCoupon = async (couponCode) => {
	if (!couponCode || !couponCode.trim()) {
		throw new Error('Coupon code is required')
	}

	const response = await apiClient.post('/api/validate-coupon', {
		couponCode: couponCode.trim()
	})

	return response.data
}
