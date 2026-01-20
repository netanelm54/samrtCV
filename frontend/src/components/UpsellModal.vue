<template>
	<BaseModal :show="store.showUpsell" size="medium" @close="store.hideUpsellModal()">
		<h3 class="upsell-title">Want to Improve Your CV?</h3>
		<p class="upsell-description">
			Get 2 professionally improved CV templates tailored to your role and job description.
		</p>
		<div class="upsell-features">
			<div class="upsell-feature">✓ Traditional Classic Template</div>
			<div class="upsell-feature">✓ Modern Minimalist Template</div>
			<div class="upsell-feature">✓ Ready to send to employers</div>
		</div>
		<div class="upsell-price">Only $6.90</div>
		<div v-if="store.error" class="error-message">
			{{ store.error }}
		</div>
		<div class="upsell-actions">
			<button @click="store.hideUpsellModal()" class="upsell-button secondary">No Thanks</button>
			<button @click="handlePurchase" :disabled="store.isLoading" class="upsell-button primary">
				<span v-if="store.isLoading">Processing...</span>
				<span v-else>Get Improved CV</span>
			</button>
		</div>
	</BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import { useCVAnalysisStore } from '../stores/index.js';

const store = useCVAnalysisStore();

const handlePurchase = async () => {
	const success = await store.handleUpsellPurchase();

	if (success) {
		store.hideUpsellModal();
		store.resetForm();
	}
};
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
	color: var(--color-primary);
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
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
	color: var(--color-white);
}

.upsell-button.primary:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.4);
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
