<template>
	<BaseModal :show="show" size="large" @close="handleClose">
		<div class="payment-modal">
			<h3 class="payment-title">Complete Payment</h3>
			
			<div v-if="paymentMode === 'test'" class="test-mode-banner">
				<div class="test-mode-content">
					<span class="test-mode-icon">🧪</span>
					<div>
						<strong>Test Mode</strong>
						<p>No real charges will be made. Use test card: 4242 4242 4242 4242</p>
					</div>
				</div>
			</div>

			<div class="payment-info">
				<div class="service-info">
					<h4>{{ serviceName }}</h4>
					<p class="service-price">${{ price.toFixed(2) }}</p>
				</div>
			</div>

			<div v-if="error" class="error-message">
				{{ error }}
			</div>

			<!-- Stripe Embedded Checkout Container -->
			<div v-if="!checkoutReady" class="payment-loading">
				<p>Loading payment form...</p>
			</div>
			
			<!-- Always render container so it exists when we mount -->
			<div id="checkout" class="checkout-container" :style="{ display: checkoutReady ? 'block' : 'none' }"></div>

			<div class="payment-actions">
				<button @click="handleClose" class="payment-button secondary" :disabled="isProcessing">
					Cancel
				</button>
			</div>
		</div>
	</BaseModal>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import BaseModal from './BaseModal.vue';
import { useCVAnalysisStore } from '../stores/index.js';
import { loadStripe } from '@stripe/stripe-js';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	serviceOption: {
		type: String,
		required: true
	},
	customerEmail: {
		type: String,
		required: true
	}
});

const emit = defineEmits(['close', 'success']);

const store = useCVAnalysisStore();

const isProcessing = computed(() => store.isProcessingPayment || store.isLoading);
const paymentMode = computed(() => store.paymentMode);
const error = computed(() => store.error);
const checkoutReady = ref(false);
const stripeInstance = ref(null);
const checkoutInstance = ref(null);

const serviceName = computed(() => {
	const names = {
		analysis: 'CV Analysis Report',
		improved: 'Improved CV Templates',
		complete: 'Complete CV Package'
	};
	return names[props.serviceOption] || 'CV Service';
});

const price = computed(() => {
	const prices = {
		analysis: 5.00,
		improved: 18.00,
		complete: 20.00
	};
	return prices[props.serviceOption] || 0;
});

const handleClose = () => {
	if (!isProcessing.value) {
		cleanupCheckout();
		store.resetPayment();
		emit('close');
	}
};

const cleanupCheckout = () => {
	if (checkoutInstance.value) {
		checkoutInstance.value.unmount();
		checkoutInstance.value = null;
	}
	checkoutReady.value = false;
};

const initializeEmbeddedCheckout = async () => {
	try {
		store.clearError();
		checkoutReady.value = false;

		console.log('Initializing embedded checkout...');

		// Create payment session with embedded flag
		const sessionData = await store.createPaymentSession(
			props.serviceOption,
			props.customerEmail,
			{
				cvFile: store.cvFile?.name || 'unknown',
				role: store.role
			},
			true // embedded = true
		);

		console.log('Session data received:', { 
			sessionId: sessionData.sessionId, 
			hasClientSecret: !!sessionData.clientSecret,
			publishableKey: !!sessionData.publishableKey
		});

		if (!sessionData.clientSecret) {
			throw new Error('Client secret not received from server. Please check backend configuration.');
		}

		// Get Stripe publishable key
		const publishableKey = sessionData.publishableKey || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

		if (!publishableKey) {
			throw new Error('Stripe publishable key is not configured.');
		}

		console.log('Loading Stripe...');
		// Initialize Stripe
		if (!stripeInstance.value) {
			stripeInstance.value = await loadStripe(publishableKey);
		}

		if (!stripeInstance.value) {
			throw new Error('Failed to initialize Stripe');
		}

		// Check if embedded checkout is supported
		if (typeof stripeInstance.value.initEmbeddedCheckout !== 'function') {
			throw new Error('Embedded Checkout is not supported. Please update @stripe/stripe-js to the latest version.');
		}

		console.log('Initializing embedded checkout with client secret...');
		console.log('Client secret:', sessionData.clientSecret ? 'Present' : 'Missing');
		
		if (!sessionData.clientSecret) {
			throw new Error('Client secret is missing from server response. Please check backend configuration.');
		}

		// Mount embedded checkout - Stripe expects a function that returns the client secret
		const checkout = await stripeInstance.value.initEmbeddedCheckout({
			fetchClientSecret: async () => {
				console.log('Fetching client secret...');
				return sessionData.clientSecret;
			}
		});

		console.log('Waiting for container...');
		// Wait a bit for the DOM to be ready
		await new Promise(resolve => setTimeout(resolve, 100));

		// Mount checkout to container
		const container = document.getElementById('checkout');
		if (!container) {
			throw new Error('Checkout container not found. Please ensure the modal is properly rendered.');
		}

		console.log('Mounting checkout to container...');
		checkout.mount(container);
		checkoutInstance.value = checkout;
		console.log('Checkout mounted successfully!');
		
		// Set ready after a brief delay to ensure rendering
		setTimeout(() => {
			checkoutReady.value = true;
		}, 50);

		// For embedded checkout, Stripe will redirect to return_url when payment completes
		// We don't process CV here - it will be handled on the success page after redirect
		// Just store the session ID for reference
		console.log('Checkout ready. Waiting for payment completion...');

	} catch (err) {
		console.error('Payment initialization error:', err);
		const errorMessage = err.response?.data?.error || err.message || 'Failed to initialize payment form';
		store.setError(errorMessage);
		checkoutReady.value = false;
	}
};

// Watch for modal show/hide
watch(() => props.show, async (newVal) => {
	if (newVal) {
		// Modal opened, wait for DOM to be ready then initialize checkout
		await new Promise(resolve => setTimeout(resolve, 200));
		await initializeEmbeddedCheckout();
	} else {
		// Modal closed, cleanup
		cleanupCheckout();
	}
}, { immediate: true });

onUnmounted(() => {
	cleanupCheckout();
});
</script>

<style scoped>
.payment-modal {
	padding: 20px;
}

.payment-title {
	font-size: 1.8rem;
	color: #333;
	margin-bottom: 20px;
	text-align: center;
}

.test-mode-banner {
	background: #fff3cd;
	border: 2px solid #ffc107;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 20px;
}

.test-mode-content {
	display: flex;
	align-items: flex-start;
	gap: 12px;
}

.test-mode-icon {
	font-size: 1.5rem;
}

.test-mode-content strong {
	display: block;
	color: #856404;
	margin-bottom: 5px;
}

.test-mode-content p {
	margin: 0;
	color: #856404;
	font-size: 0.9rem;
}

.payment-info {
	margin-bottom: 25px;
}

.service-info {
	text-align: center;
	padding: 20px;
	background: #f8f9ff;
	border-radius: 8px;
}

.service-info h4 {
	margin: 0 0 10px 0;
	color: #333;
	font-size: 1.2rem;
}

.service-price {
	margin: 0;
	font-size: 2rem;
	font-weight: 700;
	color: #667eea;
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

.payment-actions {
	display: flex;
	gap: 15px;
	justify-content: center;
}

.payment-button {
	padding: 12px 24px;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
	flex: 1;
}

.payment-button.secondary {
	background: #e0e0e0;
	color: #333;
}

.payment-button.secondary:hover:not(:disabled) {
	background: #d0d0d0;
}

.payment-button.primary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
}

.payment-button.primary:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.payment-button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.checkout-container {
	margin: 20px 0;
	min-height: 400px;
}

.payment-loading {
	text-align: center;
	padding: 40px;
	color: #666;
}
</style>

