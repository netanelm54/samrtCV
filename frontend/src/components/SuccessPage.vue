<template>
	<div class="success-page">
		<div class="container">
			<div class="success-card">
				<div class="success-icon">✅</div>
				<h1>Payment Successful!</h1>
				<div v-if="isProcessing" class="processing-state">
					<p>Verifying payment and processing your CV...</p>
					<div class="loading-spinner"></div>
				</div>
				<div v-else-if="error" class="error-state">
					<p class="error-text">{{ error }}</p>
					<button @click="retryVerification" class="retry-button">Retry</button>
				</div>
				<div v-else-if="processingComplete" class="complete-state">
					<p>Your CV analysis is being processed.</p>
					<p class="info-text">
						You will receive a detailed PDF report at your email address within a few
						minutes.
					</p>
				</div>
				<div v-else>
					<p>Verifying your payment...</p>
				</div>
				<button v-if="!isProcessing && !error" @click="goHome" class="home-button">Return Home</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCVAnalysisStore } from '../stores/index.js';

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

		// Get session ID from URL
		const sessionId = route.query.session_id;
		if (!sessionId) {
			throw new Error('No session ID found in URL');
		}

		// Verify payment session
		const verification = await store.verifyPayment(sessionId);

		if (!verification.paid) {
			throw new Error('Payment verification failed');
		}

		// Get service option from metadata
		const serviceOption = verification.metadata?.serviceOption || store.selectedOption;

		if (!serviceOption) {
			throw new Error('Service option not found');
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
			throw new Error('Failed to process CV');
		}
	} catch (err) {
		console.error('Payment verification error:', err);
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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
	color: #333;
	margin-bottom: 16px;
}

p {
	font-size: 1.1rem;
	color: #666;
	margin-bottom: 12px;
}

.info-text {
	margin-top: 24px;
	padding: 20px;
	background: #f0f7ff;
	border-radius: 8px;
	color: #333;
}

.processing-state {
	margin: 20px 0;
}

.loading-spinner {
	border: 4px solid #f3f3f3;
	border-top: 4px solid #667eea;
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
	color: #e74c3c;
	font-weight: 600;
	margin-bottom: 15px;
}

.retry-button {
	margin-top: 15px;
	padding: 12px 24px;
	background: #667eea;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.2s;
}

.retry-button:hover {
	transform: translateY(-2px);
}

.complete-state {
	margin: 20px 0;
}

.home-button {
	margin-top: 30px;
	padding: 14px 32px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 1.1rem;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.2s;
}

.home-button:hover {
	transform: translateY(-2px);
}
</style>
