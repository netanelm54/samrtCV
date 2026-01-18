<template>
	<header class="hero-section" role="banner">
		<div class="container">
			<h1 class="hero-title">SmartCV - CV Analysis & Improved CV Generator</h1>
			<p class="hero-subtitle">Get Your CV Analyzed with AI - Smart CV Analyzer & Improved CV Maker</p>
			<p class="hero-description">
				Use our AI-powered CV analyzer to get expert analysis of your resume against any job description. 
				Get improved CV templates, match scores, missing keywords, and actionable insights. 
				Try SmartCV - the best CV with AI technology for resume optimization.
			</p>
		</div>
	</header>
</template>

<script setup>
// Header component for site layout
</script>

<style scoped>
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
	width: 100%;
}

.hero-section {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	padding: 80px 20px;
	text-align: center;
}

.hero-title {
	font-size: 3rem;
	font-weight: 700;
	margin-bottom: 1rem;
	letter-spacing: -0.02em;
}

.hero-subtitle {
	font-size: 1.5rem;
	margin-bottom: 1rem;
	opacity: 0.95;
}

.hero-description {
	font-size: 1.1rem;
	opacity: 0.9;
	max-width: 600px;
	margin: 0 auto;
}

@media (max-width: 768px) {
	.hero-title {
		font-size: 2.5rem;
	}

	.hero-subtitle {
		font-size: 1.2rem;
	}
}
</style>
