<template>
	<div class="pricing-step">
		<h3 class="pricing-title">Choose Your Service</h3>
		<div class="pricing-options">
			<PricingCard
				v-for="option in pricingOptions"
				:key="option.id"
				:title="option.title"
				:price="option.price"
				:description="option.description"
				:features="option.features"
				:badge="option.badge"
				:badge-type="option.badgeType"
				:is-selected="store.selectedOption === option.id"
				@select="store.setSelectedOption(option.id)"
			/>
		</div>

		<div class="terms-checkbox-container">
			<label class="terms-checkbox-label">
				<input
					type="checkbox"
					:checked="store.termsAccepted"
					@change="store.setTermsAccepted($event.target.checked)"
					class="terms-checkbox"
				/>
				<span>
					I agree to the
					<a href="#" @click.prevent="store.openTermsModal()" class="terms-link">
						Terms of Service
					</a>
				</span>
			</label>
		</div>

		<div class="step-actions">
			<button type="button" @click="store.goToPreviousStep()" class="cta-button secondary">Back</button>
			<button
				type="button"
				@click="handleSubmit"
				:disabled="!store.canSubmit"
				class="cta-button"
			>
				<span v-if="store.isLoading">Processing...</span>
				<span v-else>Continue</span>
			</button>
		</div>

		<div v-if="store.error" class="error-message">
			{{ store.error }}
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import PricingCard from './common/PricingCard.vue';
import { useCVAnalysisStore } from '../stores/index.js';

const store = useCVAnalysisStore();

const handleSubmit = async () => {
	const success = await store.processCV();

	if (!success) {
		return;
	}

	// If analysis option was selected, show upsell modal
	if (store.selectedOption === 'analysis') {
		store.showUpsellModal();
		return;
	}

	// Reset form for other options
	store.resetAfterSuccess();
};

const pricingOptions = ref([
	{
		id: 'analysis',
		title: 'Analysis Only',
		price: 5,
		description: 'Get detailed CV analysis report',
		features: ['Match Score', 'Missing Keywords', 'Actionable Recommendations']
	},
	{
		id: 'improved',
		title: 'Improved CV',
		price: 18,
		description: 'Get 2 improved CV templates',
		features: ['Traditional Classic Template', 'Modern Minimalist Template', 'Ready to send'],
		badge: 'Most Popular',
		badgeType: 'popular'
	},
	{
		id: 'complete',
		title: 'Complete Package',
		price: 20,
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
</script>

<style scoped>
.pricing-step {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.pricing-title {
	font-size: 1.5rem;
	margin-bottom: 20px;
	color: #333;
	text-align: center;
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
		box-shadow 0.2s;
}

.cta-button:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
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
	border: 1px solid #fcc;
	border-radius: 6px;
	color: #c33;
	font-size: 0.9rem;
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
	width: 18px;
	height: 18px;
	cursor: pointer;
	accent-color: #667eea;
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

@media (max-width: 768px) {
	.pricing-options {
		grid-template-columns: 1fr;
	}
}
</style>
