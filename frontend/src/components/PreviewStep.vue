<template>
	<div class="preview-step">
		<h3 class="preview-title">Preview Your Improved CV</h3>
		<p class="preview-subtitle">See a preview of your optimized Professional Summary. Get the full improved CV with all sections optimized for your target role.</p>

		<div class="preview-container">
			<div class="preview-header">
				<h4 class="preview-section-title">Professional Summary</h4>
			</div>
			<div class="preview-content">
				<p v-if="isLoading" class="loading-text">Generating preview...</p>
				<p v-else-if="error" class="error-text">{{ error }}</p>
				<p v-else-if="professionalSummary" class="summary-text">{{ professionalSummary }}</p>
				<p v-else class="empty-text">No preview available</p>
			</div>
		</div>

		<div class="preview-cta">
			<p class="cta-text">Ready to see your complete improved CV?</p>
			<p class="cta-subtext">Get 2 professional templates optimized for your target role, plus a detailed analysis report.</p>
		</div>

		<div class="step-actions">
			<button type="button" @click="store.goToPreviousStep()" class="cta-button secondary">Back</button>
			<button
				type="button"
				@click="handleContinue"
				:disabled="store.isLoading"
				class="cta-button"
			>
				<span v-if="store.isLoading">Loading...</span>
				<span v-else>Get Improved CV</span>
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
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCVAnalysisStore } from '../stores/index.js';

const store = useCVAnalysisStore();
const professionalSummary = ref('');
const isLoading = ref(false);
const error = ref('');

const loadPreview = async () => {
	if (!store.cvFile || !store.role) {
		error.value = 'Missing required information. Please go back and fill in all fields.';
		return;
	}

	isLoading.value = true;
	error.value = '';
	store.clearError();

	try {
		const result = await store.getPreviewSummary();
		if (result && result.professional_summary) {
			professionalSummary.value = result.professional_summary;
		} else {
			error.value = 'Failed to generate preview. Please try again.';
		}
	} catch (err) {
		console.error('Error loading preview:', err);
		error.value = err.response?.data?.error || 'Failed to load preview. Please try again.';
	} finally {
		isLoading.value = false;
	}
};

const handleContinue = () => {
	// Navigate to pricing step
	store.goToNextStep();
};

onMounted(() => {
	loadPreview();
});
</script>

<style scoped>
.preview-step {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.preview-title {
	font-size: 1.5rem;
	margin-bottom: 10px;
	color: var(--color-text);
	text-align: center;
}

.preview-subtitle {
	text-align: center;
	color: var(--color-text-light);
	font-size: 1rem;
	margin-bottom: 20px;
	max-width: 800px;
	margin-left: auto;
	margin-right: auto;
	line-height: 1.6;
}

.preview-container {
	background: #f5f5f5;
	border-radius: 12px;
	padding: 32px;
	margin: 20px 0;
	border: 1px solid #e0e0e0;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.preview-header {
	margin-bottom: 20px;
	padding-bottom: 12px;
	border-bottom: 2px solid #2c3e50;
}

.preview-section-title {
	font-size: 1.1rem;
	font-weight: 600;
	color: #2c3e50;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	margin: 0;
}

.preview-content {
	min-height: 120px;
}

.summary-text {
	font-family: 'Georgia', 'Times New Roman', serif;
	font-size: 1.05rem;
	line-height: 1.8;
	color: #333;
	text-align: left;
	margin: 0;
	white-space: pre-wrap;
}

.loading-text,
.empty-text {
	color: var(--color-text-light);
	font-style: italic;
	text-align: center;
	margin: 40px 0;
}

.error-text {
	color: #e74c3c;
	text-align: center;
	margin: 40px 0;
	font-weight: 500;
}

.preview-cta {
	background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
	border-radius: 8px;
	padding: 24px;
	text-align: center;
	margin: 20px 0;
	border: 1px solid rgba(102, 126, 234, 0.2);
}

.cta-text {
	font-size: 1.1rem;
	font-weight: 600;
	color: var(--color-text);
	margin-bottom: 8px;
}

.cta-subtext {
	font-size: 0.95rem;
	color: var(--color-text-light);
	margin: 0;
	line-height: 1.5;
}

.step-actions {
	display: flex;
	gap: 16px;
	justify-content: center;
	margin-top: 20px;
}

.cta-button {
	padding: 16px 32px;
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
	color: var(--color-white);
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
	min-width: 160px;
}

.cta-button:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 12px rgba(var(--color-primary-rgb), 0.4);
}

.cta-button:focus {
	outline: 3px solid var(--color-primary);
	outline-offset: 2px;
}

.cta-button:focus-visible {
	outline: 3px solid var(--color-primary);
	outline-offset: 2px;
}

.cta-button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.cta-button.secondary {
	background: #e0e0e0;
	color: var(--color-text);
}

.cta-button.secondary:hover:not(:disabled) {
	background: #d0d0d0;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
	padding: 12px;
	background: #fee;
	border: 2px solid #c33;
	border-radius: 6px;
	color: #8b0000;
	font-size: 1rem;
	font-weight: 500;
	margin-top: 16px;
}
</style>
