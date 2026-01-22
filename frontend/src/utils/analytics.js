/**
 * Analytics utility for tracking funnel events
 * Logs structured events that can be queried in Railway
 */

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Generate or retrieve session ID
 */
const getSessionId = () => {
	let sessionId = sessionStorage.getItem('analytics_session_id')
	if (!sessionId) {
		sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
		sessionStorage.setItem('analytics_session_id', sessionId)
	}
	return sessionId
}

/**
 * Track an event by sending it to backend analytics endpoint
 */
const trackEvent = async (eventName, eventData = {}) => {
	const event = {
		timestamp: new Date().toISOString(),
		event: eventName,
		...eventData,
		// Add session ID for tracking user journey
		sessionId: getSessionId(),
		// Add user agent and referrer for context
		userAgent: navigator.userAgent,
		referrer: document.referrer,
		url: window.location.href
	}

	// Send to backend analytics endpoint
	try {
		const response = await fetch(`${API_URL}/api/analytics`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(event)
		})

		if (!response.ok) {
			throw new Error(`Analytics request failed: ${response.status}`)
		}
	} catch (error) {
		console.error('Analytics error:', error)
		// Fallback: log to console for Railway to pick up
		console.log(JSON.stringify({
			type: 'analytics',
			...event
		}))
	}
}

/**
 * Analytics API - Funnel tracking methods
 */
export const analytics = {
	/**
	 * 1. Page View - Track when user lands on the page
	 */
	trackPageView: () => {
		trackEvent('page_view', {
			step: 'landing',
			funnel_step: 1
		})
	},

	/**
	 * 2. Step 1 Success - File Upload + Details Completed
	 * Tracked when user successfully uploads file and fills in details
	 */
	trackStep1Success: (data) => {
		trackEvent('step_1_success', {
			step: 'form_complete',
			funnel_step: 2,
			hasFile: !!data.file,
			hasRole: !!data.role,
			hasJobDescription: !!data.jobDescription,
			fileSize: data.file?.size || 0,
			fileName: data.file?.name || null,
			fileType: data.file?.type || null
		})
	},

	/**
	 * 3. Step 2 Start - Plan Selection View
	 * Tracked when user reaches pricing step
	 */
	trackStep2Start: (data) => {
		trackEvent('step_2_start', {
			step: 'pricing_view',
			funnel_step: 3,
			selectedPlan: data.selectedOption || null
		})
	},

	/**
	 * 4. Payment Initiated - Continue to Payment Clicked
	 * Tracked when user clicks "Continue to Payment" button
	 */
	trackPaymentInitiated: (data) => {
		trackEvent('payment_initiated', {
			step: 'payment_start',
			funnel_step: 4,
			selectedPlan: data.selectedOption,
			customerEmail: data.customerEmail,
			termsAccepted: data.termsAccepted,
			price: data.price
		})
	},

	/**
	 * 5. Payment Success - Payment Completed Successfully
	 * Tracked when payment is verified as successful
	 */
	trackPaymentSuccess: (data) => {
		trackEvent('payment_success', {
			step: 'payment_complete',
			funnel_step: 5,
			sessionId: data.sessionId,
			selectedPlan: data.serviceOption,
			amount: data.amount
		})
	},

	/**
	 * 6. File Received - User Successfully Received File
	 * Tracked when file download/processing completes
	 */
	trackFileReceived: (data) => {
		trackEvent('file_received', {
			step: 'file_download',
			funnel_step: 6,
			serviceOption: data.serviceOption,
			fileName: data.fileName,
			fileType: data.fileType
		})
	},

	/**
	 * Track errors for debugging
	 */
	trackError: (error, context) => {
		trackEvent('error', {
			step: context.step || 'unknown',
			error: error.message,
			errorType: error.name,
			context
		})
	},

	/**
	 * Track step abandonment
	 */
	trackAbandonment: (step, data) => {
		trackEvent('abandonment', {
			step,
			funnel_step: step === 1 ? 2 : step === 2 ? 3 : null,
			data
		})
	},

	/**
	 * Track coupon used
	 */
	trackCouponUsed: (data) => {
		trackEvent('coupon_used', data)
	}
}

export default analytics
