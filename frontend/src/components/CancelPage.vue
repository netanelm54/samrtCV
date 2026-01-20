<template>
	<div class="cancel-page">
		<main class="container" role="main">
			<div class="cancel-card">
				<div class="cancel-icon" aria-hidden="true">❌</div>
				<h1>Payment Cancelled</h1>
				<p>Your payment was cancelled. No charges were made.</p>
				<button 
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
import { useRouter } from 'vue-router';
import { useCVAnalysisStore } from '../stores/index.js';
import { restoreFormData } from '../utils/persistence.js';

const router = useRouter();
const store = useCVAnalysisStore();

// Restore form data when canceling payment so user can retry
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
}

const goHome = () => {
	router.push('/');
};
</script>

<style scoped>
.cancel-page {
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

.cancel-card {
	background: white;
	border-radius: 12px;
	padding: 60px 40px;
	text-align: center;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.cancel-icon {
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
	margin-bottom: 24px;
}

.home-button {
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
