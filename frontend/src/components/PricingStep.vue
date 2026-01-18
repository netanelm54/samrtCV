<template>
	<div class="pricing-step">
		<h3 class="pricing-title">Choose Your Service</h3>
		<p class="pricing-subtitle">Select from our AI-powered CV analysis and improved CV generation services. Get professional CV optimization with SmartCV.</p>
		<div class="pricing-options">
			<PricingCard
				v-for="option in pricingOptions"
				:key="option.id"
				:title="option.title"
				:price="option.price"
				:original-price="option.originalPrice"
				:description="option.description"
				:features="option.features"
				:badge="option.badge"
				:badge-type="option.badgeType"
				:is-selected="store.selectedOption === option.id"
				@select="store.setSelectedOption(option.id)"
			/>
		</div>

		<div class="email-input-container">
			<label for="customer-email" class="email-label">
				Email Address <span class="required" aria-label="required">*</span>
			</label>
			<input
				id="customer-email"
				v-model="customerEmail"
				type="email"
				placeholder="your.email@example.com"
				required
				class="email-input"
				aria-required="true"
				aria-describedby="email-description"
			/>
			<span id="email-description" class="sr-only">Enter your email address to receive the CV analysis report</span>
		</div>

		<div class="terms-checkbox-container">
			<label class="terms-checkbox-label">
				<input
					type="checkbox"
					:checked="store.termsAccepted"
					@change="store.setTermsAccepted($event.target.checked)"
					class="terms-checkbox"
					aria-required="true"
					aria-describedby="terms-description"
				/>
				<span>
					I agree to the
					<a 
						href="#" 
						@click.prevent="store.openTermsModal()" 
						class="terms-link"
						aria-label="Open Terms of Service modal"
					>
						Terms of Service
					</a>
				</span>
			</label>
			<span id="terms-description" class="sr-only">You must accept the terms of service to proceed</span>
		</div>

		<div class="step-actions">
			<button type="button" @click="store.goToPreviousStep()" class="cta-button secondary">Back</button>
			<button
				type="button"
				@click="handleSubmit"
				:disabled="!canProceed"
				class="cta-button"
			>
				<span v-if="store.isProcessingPayment">Processing...</span>
				<span v-else>Continue to Payment</span>
			</button>
		</div>

		<div 
			v-if="store.error" 
			class="error-message"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			{{ store.error }}
		</div>

		<!-- Payment Modal -->
		<PaymentModal
			v-if="showPaymentModal"
			:show="showPaymentModal"
			:service-option="store.selectedOption"
			:customer-email="customerEmail"
			@close="showPaymentModal = false"
			@success="handlePaymentSuccess"
		/>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PricingCard from './common/PricingCard.vue';
import PaymentModal from './PaymentModal.vue';
import { useCVAnalysisStore } from '../stores/index.js';
import { saveFormData } from '../utils/persistence.js';
import analytics from '../utils/analytics.js';

const store = useCVAnalysisStore();
const customerEmail = ref('');
const showPaymentModal = ref(false);

// Track step 2 start when component mounts
onMounted(() => {
	analytics.trackStep2Start({
		selectedOption: store.selectedOption
	});
});

const canProceed = computed(() => {
	return store.selectedOption && 
		   store.termsAccepted && 
		   customerEmail.value.trim() && 
		   isValidEmail(customerEmail.value) &&
		   !store.isProcessingPayment;
});

const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

const pricingOptions = ref([
	{
		id: 'analysis',
		title: 'Analysis Only',
		price: 3.90,
		originalPrice: 10,
		description: 'Get detailed CV analysis report',
		features: ['Match Score', 'Missing Keywords', 'Actionable Recommendations']
	},
	{
		id: 'improved',
		title: 'Improved CV',
		price: 6.90,
		originalPrice: 30,
		description: 'Get 2 improved CV templates',
		features: ['Traditional Classic Template', 'Modern Minimalist Template', 'Ready to send'],
		badge: 'Most Popular',
		badgeType: 'popular'
	},
	{
		id: 'complete',
		title: 'Complete Package',
		price: 9.90,
		originalPrice: 40,
		description: 'Get analysis report + 2 improved CV templates',
		features: [
			'Full Analysis Report',
			'Traditional Classic Template',
			'Modern Minimalist Template',
			'Best Value'
		],
		badge: 'Best Value',
		badgeType: 'best-value'
	}
]);

const handleSubmit = async () => {
	if (!canProceed.value) {
		if (!customerEmail.value.trim()) {
			store.setError('Please enter your email address');
		} else if (!isValidEmail(customerEmail.value)) {
			store.setError('Please enter a valid email address');
		}
		return;
	}

	// Track payment initiated
	const selectedPlan = pricingOptions.value.find(opt => opt.id === store.selectedOption);
	analytics.trackPaymentInitiated({
		selectedOption: store.selectedOption,
		customerEmail: customerEmail.value,
		termsAccepted: store.termsAccepted,
		price: selectedPlan?.price || 0
	});

	// Save form data to localStorage before opening payment modal
	// This ensures the file and form data persist across Stripe redirect
	try {
		await saveFormData({
			cvFile: store.cvFile,
			role: store.role,
			jobDescription: store.jobDescription,
			selectedOption: store.selectedOption
		});
	} catch (error) {
		console.error('Failed to save form data:', error);
		analytics.trackError(error, { step: 'pricing_save_data' });
		store.setError('Failed to save form data. Please try again.');
		return;
	}

	showPaymentModal.value = true;
};

const handlePaymentSuccess = () => {
	showPaymentModal.value = false;
	// Payment success will redirect to Stripe, so this won't be called
	// But if payment is verified via webhook, we'll process CV
};
</script>

<style scoped>
.pricing-step {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.pricing-title {
	font-size: 1.5rem;
	margin-bottom: 10px;
	color: #333;
	text-align: center;
}

.pricing-subtitle {
	font-size: 1rem;
	margin-bottom: 30px;
	color: #666;
	text-align: center;
	max-width: 700px;
	margin-left: auto;
	margin-right: auto;
	line-height: 1.6;
}

.pricing-options {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	margin-bottom: 30px;
}

@media (min-width: 1024px) {
	.pricing-options {
		width: 150%;
		margin-inline-start: -25%;
	}
}

.step-actions {
	display: flex;
	gap: 15px;
	justify-content: center;
}

.cta-button {
	padding: 16px 32px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 1.1rem;
	font-weight: 600;
	cursor: pointer;
	transition:
		transform 0.2s,
		box-shadow 0.2s,
		outline 0.2s;
	min-height: 44px;
}

.cta-button:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.cta-button:focus {
	outline: 3px solid #667eea;
	outline-offset: 2px;
}

.cta-button:focus-visible {
	outline: 3px solid #667eea;
	outline-offset: 2px;
}

.cta-button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.cta-button.secondary {
	background: #e0e0e0;
	color: #333;
}

.cta-button.secondary:hover:not(:disabled) {
	background: #d0d0d0;
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.error-message {
	padding: 12px;
	background: #fee;
	border: 2px solid #c33;
	border-radius: 6px;
	color: #8b0000;
	font-size: 1rem;
	font-weight: 500;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

.terms-checkbox-container {
	margin: 20px 0;
	padding: 15px;
	background: #f8f9ff;
	border-radius: 8px;
}

.terms-checkbox-label {
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	color: #333;
	font-size: 0.95rem;
}

.terms-checkbox {
	width: 20px;
	height: 20px;
	min-width: 20px;
	min-height: 20px;
	cursor: pointer;
	accent-color: #667eea;
}

.terms-checkbox:focus {
	outline: 3px solid #667eea;
	outline-offset: 2px;
	border-radius: 2px;
}

.terms-link {
	color: #667eea;
	text-decoration: underline;
	font-weight: 600;
	transition: color 0.2s;
}

.terms-link:hover {
	color: #764ba2;
}

.email-input-container {
	margin: 20px 0;
}

.email-label {
	display: block;
	font-weight: 600;
	color: #333;
	font-size: 0.95rem;
	margin-bottom: 8px;
}

.required {
	color: #e74c3c;
}

.email-input {
	width: 100%;
	padding: 12px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 1rem;
	font-family: inherit;
	transition: border-color 0.3s, outline 0.2s;
	min-height: 44px;
}

.email-input:focus {
	outline: 3px solid #667eea;
	outline-offset: 2px;
	border-color: #667eea;
}

.email-input:focus-visible {
	outline: 3px solid #667eea;
	outline-offset: 2px;
}

@media (max-width: 768px) {
	.pricing-options {
		grid-template-columns: 1fr;
	}
}
</style>
