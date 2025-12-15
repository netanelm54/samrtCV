<template>
  <BaseModal :show="show" size="medium" @close="$emit('close')">
    <h3 class="upsell-title">Want to Improve Your CV?</h3>
    <p class="upsell-description">
      Get 2 professionally improved CV templates tailored to your role and job description.
    </p>
    <div class="upsell-features">
      <div class="upsell-feature">✓ Traditional Classic Template</div>
      <div class="upsell-feature">✓ Modern Minimalist Template</div>
      <div class="upsell-feature">✓ Ready to send to employers</div>
    </div>
    <div class="upsell-price">Only $18</div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div class="upsell-actions">
      <button @click="$emit('close')" class="upsell-button secondary">No Thanks</button>
      <button @click="$emit('purchase')" :disabled="isLoading" class="upsell-button primary">
        <span v-if="isLoading">Processing...</span>
        <span v-else>Get Improved CV</span>
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['close', 'purchase'])
</script>

<style scoped>

.upsell-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.upsell-description {
  color: #666;
  margin-bottom: 25px;
  text-align: center;
  line-height: 1.6;
}

.upsell-features {
  background: #f8f9ff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
}

.upsell-feature {
  color: #333;
  padding: 8px 0;
  font-size: 0.95rem;
}

.upsell-price {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 25px;
}

.upsell-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.upsell-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.upsell-button.secondary {
  background: #e0e0e0;
  color: #333;
}

.upsell-button.secondary:hover {
  background: #d0d0d0;
}

.upsell-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.upsell-button.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.upsell-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  font-size: 0.9rem;
  margin-bottom: 15px;
}
</style>
