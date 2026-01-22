<template>
	<div class="success-page">
		<main class="container" role="main">
			<div class="success-card">
				<div class="success-icon" aria-hidden="true">✅</div>
				<h1>Payment Successful!</h1>
				<div v-if="isProcessing" class="processing-state" role="status" aria-live="polite" aria-busy="true">
					<p>Verifying payment and processing your CV...</p>
					<div class="loading-spinner" aria-label="Loading"></div>
				</div>
				<div v-else-if="error" class="error-state" role="alert" aria-live="assertive">
					<p class="error-text">{{ error }}</p>
					<button @click="retryVerification" class="retry-button" aria-label="Retry payment verification">
						Retry
					</button>
				</div>
				<div v-else-if="processingComplete" class="complete-state" role="status" aria-live="polite">
					<p>Your CV analysis is being processed.</p>
					<p class="info-text">
						Your PDF report is downloading directly to your computer. You will receive a payment invoice via email.
					</p>
				</div>
				<div v-else role="status" aria-live="polite">
					<p>Verifying your payment...</p>
				</div>
				<button 
					v-if="!isProcessing && !error" 
					@click="goHome" 
					class="home-button"
					aria-label="Return to home page"
				>
					Return Home
				</button>
			</div>
		</main>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCVAnalysisStore } from '../stores/index.js';
import { restoreFormData, clearFormData } from '../utils/persistence.js';
import analytics from '../utils/analytics.js';

const router = useRouter();
const route = useRoute();
const store = useCVAnalysisStore();

const isProcessing = ref(true);
const processingComplete = ref(false);
const error = ref('');

const verifyAndProcess = async () => {
	try {
		isProcessing.value = true;
		error.value = '';
		store.clearError();

		// Restore form data from localStorage before processing
		// This ensures we have the file and form data after Stripe redirect
		const restoredData = restoreFormData();
		if (restoredData) {
			if (restoredData.cvFile) {
				store.setCVFile(restoredData.cvFile);
			}
			if (restoredData.role) {
				store.setRole(restoredData.role);
			}
			if (restoredData.jobDescription) {
				store.setJobDescription(restoredData.jobDescription);
			}
			if (restoredData.selectedOption) {
				store.setSelectedOption(restoredData.selectedOption);
			}
		} else {
			throw new Error('Form data not found. Please start over.');
		}

		// Get session ID from URL
		const sessionId = route.query.session_id;
		if (!sessionId) {
			throw new Error('No session ID found in URL');
		}

		// Verify payment session
		const verification = await store.verifyPayment(sessionId);

		if (!verification.paid) {
			analytics.trackError(new Error('Payment verification failed'), { step: 'payment_verification' });
			throw new Error('Payment verification failed');
		}

		// Track payment success
		analytics.trackPaymentSuccess({
			sessionId: sessionId,
			serviceOption: verification.metadata?.serviceOption,
			amount: verification.amount_total ? verification.amount_total / 100 : null
		});

		// Get service option from metadata or restored data
		const serviceOption = verification.metadata?.serviceOption || store.selectedOption;

		if (!serviceOption) {
			throw new Error('Service option not found');
		}

		// Verify we have the required file and role
		if (!store.cvFile) {
			throw new Error('CV file not found. Please upload your CV again.');
		}
		if (!store.role || !store.role.trim()) {
			throw new Error('Role information not found. Please enter your role again.');
		}

		// Process CV based on service option
		let success = false;
		switch (serviceOption) {
			case 'analysis':
				success = await store.analyzeOnly();
				break;
			case 'improved':
				success = await store.improveOnly();
				break;
			case 'complete':
				success = await store.analyzeAndImprove();
				break;
			default:
				throw new Error('Invalid service option');
		}

		if (success) {
			processingComplete.value = true;
			
			// Track file received
			const fileType = serviceOption === 'analysis' ? 'application/pdf' : 'application/zip';
			const fileName = serviceOption === 'analysis' 
				? `CV-Analysis-Report-${Date.now()}.pdf`
				: serviceOption === 'improved'
				? `Improved-CV-${Date.now()}.zip`
				: `CV-Complete-Package-${Date.now()}.zip`;
			
			analytics.trackFileReceived({
				serviceOption: serviceOption,
				fileName: fileName,
				fileType: fileType
			});
			
			// Clear localStorage after successful processing
			clearFormData();
			
			// If analysis only, show upsell modal after a delay
			if (serviceOption === 'analysis') {
				setTimeout(() => {
					store.showUpsellModal();
					router.push('/');
				}, 2000);
			} else {
				// Reset form after success
				setTimeout(() => {
					store.resetAfterSuccess();
				}, 3000);
			}
		} else {
			analytics.trackError(new Error('Failed to process CV'), { step: 'cv_processing' });
			throw new Error('Failed to process CV');
		}
	} catch (err) {
		console.error('Payment verification error:', err);
		analytics.trackError(err, { step: 'payment_verification' });
		error.value = err.response?.data?.error || err.message || 'Failed to verify payment';
	} finally {
		isProcessing.value = false;
	}
};

const retryVerification = () => {
	verifyAndProcess();
};

const goHome = () => {
	router.push('/');
};

onMounted(() => {
	// Only verify if we have a session_id (from Stripe redirect)
	if (route.query.session_id) {
		verifyAndProcess();
	} else if (route.query.coupon === 'true') {
		// Coupon flow - CV already processed, just show success
		isProcessing.value = false;
		processingComplete.value = true;
	} else {
		// If no session_id, just show success message (for non-payment flows)
		isProcessing.value = false;
		processingComplete.value = true;
	}
});
</script>

<style scoped>
.success-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
	padding: 20px;
}

.container {
	max-width: 600px;
	width: 100%;
}

.success-card {
	background: white;
	border-radius: 12px;
	padding: 60px 40px;
	text-align: center;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.success-icon {
	font-size: 4rem;
	margin-bottom: 20px;
}

h1 {
	font-size: 2.5rem;
	color: var(--color-text);
	margin-bottom: 16px;
}

p {
	font-size: 1.1rem;
	color: var(--color-text-light);
	margin-bottom: 12px;
}

.info-text {
	margin-top: 24px;
	padding: 20px;
	background: #f0f7ff;
	border-radius: 8px;
	color: var(--color-text);
}

.processing-state {
	margin: 20px 0;
}

.loading-spinner {
	border: 4px solid #f3f3f3;
	border-top: 4px solid var(--color-primary);
	border-radius: 50%;
	width: 40px;
	height: 40px;
	animation: spin 1s linear infinite;
	margin: 20px auto;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.error-state {
	margin: 20px 0;
}

.error-text {
	color: #8b0000;
	font-weight: 600;
	margin-bottom: 15px;
	font-size: 1rem;
}

.retry-button {
	margin-top: 15px;
	padding: 12px 24px;
	background: var(--color-primary);
	color: var(--color-white);
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.2s, outline 0.2s;
	min-height: 44px;
}

.retry-button:hover {
	transform: translateY(-2px);
}

.retry-button:focus {
	outline: 3px solid var(--color-primary);
	outline-offset: 2px;
}

.retry-button:focus-visible {
	outline: 3px solid var(--color-primary);
	outline-offset: 2px;
}

.complete-state {
	margin: 20px 0;
}

.home-button {
	margin-top: 30px;
	padding: 14px 32px;
	background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
	color: var(--color-white);
	border: none;
	border-radius: 8px;
	font-size: 1.1rem;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.2s, outline 0.2s;
	min-height: 44px;
}

.home-button:hover {
	transform: translateY(-2px);
}

.home-button:focus {
	outline: 3px solid var(--color-primary);
	outline-offset: 2px;
}

.home-button:focus-visible {
	outline: 3px solid var(--color-primary);
	outline-offset: 2px;
}
</style>
