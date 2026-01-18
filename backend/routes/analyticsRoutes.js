import express from 'express'

const router = express.Router()

/**
 * Analytics endpoint - logs structured events for Railway querying
 * POST /api/analytics
 */
router.post('/analytics', (req, res) => {
	const event = req.body

	// Log structured JSON for Railway to query
	// Railway automatically parses JSON logs and makes them searchable
	console.log(JSON.stringify({
		type: 'funnel_event',
		timestamp: event.timestamp || new Date().toISOString(),
		event: event.event,
		funnel_step: event.funnel_step,
		step: event.step,
		session_id: event.sessionId,
		// Include all event data for detailed tracking
		...event
	}))

	res.json({ success: true })
})

export default router
