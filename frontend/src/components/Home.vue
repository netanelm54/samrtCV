<template>
	<div class="home">
		<a href="#main-content" class="skip-link">Skip to main content</a>
		<Header />

		<main id="main-content" class="main-content" role="main">
			<div class="container">
				<div class="form-container">
					<!-- Step 1: Upload and Basic Info -->
					<FormStep v-if="store.currentStep === 1" />

					<!-- Step 2: Choose Service Option -->
					<PricingStep v-if="store.currentStep === 2" />
				</div>

				<!-- Upsell Modal -->
				<UpsellModal />

				<!-- Terms of Service Modal -->
				<TermsOfServiceModal />

				<section class="features-section" aria-labelledby="features-title">
					<h3 id="features-title" class="features-title">What You'll Get with SmartCV - CV Analysis & Improved CV</h3>
					<p class="features-intro">Our AI-powered CV analyzer provides comprehensive resume analysis and generates improved CV templates. Get professional CV optimization with SmartCV.</p>
					<div class="features-grid" role="list">
						<FeatureCard
							v-for="feature in features"
							:key="feature.id"
							:icon="feature.icon"
							:title="feature.title"
							:description="feature.description"
							role="listitem"
						/>
					</div>
				</section>
			</div>
		</main>

		<Footer />
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from './layout/Header.vue';
import Footer from './layout/Footer.vue';
import UpsellModal from './UpsellModal.vue';
import FormStep from './FormStep.vue';
import PricingStep from './PricingStep.vue';
import FeatureCard from './common/FeatureCard.vue';
import TermsOfServiceModal from './TermsOfServiceModal.vue';
import { useCVAnalysisStore } from '../stores/index.js';
import analytics from '../utils/analytics.js';

// Use Pinia store for state management (only needed for conditional rendering)
const store = useCVAnalysisStore();

// Track page view when component mounts
onMounted(() => {
	analytics.trackPageView();
});

// Static features data
const features = ref([
	{
		id: 1,
		icon: '📊',
		title: 'AI CV Match Score',
		description: 'See how well your CV matches the job description with our smart CV analyzer (0-100 score)'
	},
	{
		id: 2,
		icon: '🔍',
		title: 'Missing Keywords Analysis',
		description: 'Identify critical keywords you should add to your CV for better ATS optimization'
	},
	{
		id: 3,
		icon: '⚡',
		title: 'Actionable CV Improvements',
		description: 'Get specific recommendations to improve your resume with AI-powered insights'
	},
	{
		id: 4,
		icon: '🤖',
		title: 'AI-Powered CV Analysis',
		description: 'Advanced artificial intelligence analyzes your CV structure, content, and formatting'
	},
	{
		id: 5,
		icon: '✨',
		title: 'Improved CV Templates',
		description: 'Get professional, ready-to-send improved CV PDFs optimized for your target job'
	},
	{
		id: 6,
		icon: '🎯',
		title: 'CV Optimization',
		description: 'Optimize your CV with AI to increase your chances of getting noticed by employers'
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

.features-intro {
	text-align: center;
	color: #666;
	font-size: 1rem;
	margin-bottom: 30px;
	max-width: 700px;
	margin-left: auto;
	margin-right: auto;
	line-height: 1.6;
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
