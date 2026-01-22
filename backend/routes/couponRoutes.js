import express from 'express'
import couponController from '../controllers/couponController.js'

const router = express.Router()

// Validate coupon code
router.post('/validate-coupon', couponController.validateCoupon.bind(couponController))

export default router
