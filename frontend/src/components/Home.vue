<template>
	<div class="home">
		<Header />

		<main class="main-content">
			<div class="container">
				<div class="form-container">
					<h2 class="form-title">Get Your CV Analysis</h2>

					<!-- Step 1: Upload and Basic Info -->
					<FormStep v-if="store.currentStep === 1" />

					<!-- Step 2: Choose Service Option -->
					<PricingStep v-if="store.currentStep === 2" />
				</div>

				<!-- Upsell Modal -->
				<UpsellModal />

				<!-- Terms of Service Modal -->
				<TermsOfServiceModal />

				<div class="features-section">
					<h3 class="features-title">What You'll Get</h3>
					<div class="features-grid">
						<FeatureCard
							v-for="feature in features"
							:key="feature.id"
							:icon="feature.icon"
							:title="feature.title"
							:description="feature.description"
						/>
					</div>
				</div>
			</div>
		</main>

		<Footer />
	</div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './layout/Header.vue';
import Footer from './layout/Footer.vue';
import UpsellModal from './UpsellModal.vue';
import FormStep from './FormStep.vue';
import PricingStep from './PricingStep.vue';
import FeatureCard from './common/FeatureCard.vue';
import TermsOfServiceModal from './TermsOfServiceModal.vue';
import { useCVAnalysisStore } from '../stores/index.js';

// Use Pinia store for state management (only needed for conditional rendering)
const store = useCVAnalysisStore();

// Static features data
const features = ref([
	{
		id: 1,
		icon: '📊',
		title: 'Match Score',
		description: 'See how well your CV matches the job description (0-100)'
	},
	{
		id: 2,
		icon: '🔍',
		title: 'Missing Keywords',
		description: 'Identify critical keywords you should add to your CV'
	},
	{
		id: 3,
		icon: '⚡',
		title: 'Actionable Fixes',
		description: 'Get specific recommendations to improve your resume'
	},
	{
		id: 5,
		icon: '✨',
		title: 'Ready-to-Send CV',
		description: 'Get a professional, improved CV PDF ready to send to employers'
	}
]);
</script>

<style scoped>
.home {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
	width: 100%;
}

.main-content {
	flex: 1;
	padding: 60px 20px;
	background: #f5f5f5;
}

.form-container {
	background: white;
	border-radius: 12px;
	padding: 40px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	margin-bottom: 60px;
	max-width: 700px;
	margin-left: auto;
	margin-right: auto;
}

.form-title {
	font-size: 2rem;
	margin-bottom: 30px;
	color: #333;
	text-align: center;
}

.features-section {
	margin-top: 60px;
}

.features-title {
	text-align: center;
	font-size: 2rem;
	margin-bottom: 40px;
	color: #333;
}

.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 30px;
	margin-top: 40px;
}

@media (max-width: 768px) {
	.form-container {
		padding: 30px 20px;
	}

	.features-grid {
		grid-template-columns: 1fr;
	}
}
</style>
