/**
 * Controller for coupon code validation
 */

class CouponController {
  /**
   * Validates a coupon code
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async validateCoupon(req, res) {
    try {
      const { couponCode } = req.body;

      if (!couponCode || !couponCode.trim()) {
        return res.status(400).json({ 
          valid: false, 
          error: 'Coupon code is required' 
        });
      }

      // Get valid coupon codes from environment variable
      // Format: COUPON1,COUPON2,COUPON3
      const validCoupons = process.env.VALID_COUPON_CODES 
        ? process.env.VALID_COUPON_CODES.split(',').map(code => code.trim().toUpperCase())
        : [];

      const normalizedCode = couponCode.trim().toUpperCase();

      if (validCoupons.length === 0) {
        console.warn('No coupon codes configured in VALID_COUPON_CODES environment variable');
        return res.status(400).json({ 
          valid: false, 
          error: 'Coupon code is invalid' 
        });
      }

      const isValid = validCoupons.includes(normalizedCode);

      if (isValid) {
        console.log(`Valid coupon code used: ${normalizedCode}`);
        return res.json({ 
          valid: true, 
          message: 'Coupon code is valid' 
        });
      } else {
        console.log(`Invalid coupon code attempted: ${normalizedCode}`);
        return res.status(400).json({ 
          valid: false, 
          error: 'Invalid coupon code' 
        });
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      return res.status(500).json({ 
        valid: false, 
        error: 'Failed to validate coupon code' 
      });
    }
  }
}

export default new CouponController()
