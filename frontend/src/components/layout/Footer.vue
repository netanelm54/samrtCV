<template>
	<footer class="footer" role="contentinfo">
		<div class="container">
			<div class="footer-content">
				<div class="footer-brand">
					<h3 class="brand-name">SmartCV</h3>
					<p class="brand-tagline">AI-Powered CV Analysis & Improvement</p>
				</div>

				<nav class="footer-links" aria-label="Footer navigation">
					<h4 class="links-title">Quick Links</h4>
					<ul class="links-list">
						<li>
							<button 
								@click="openTermsModal" 
								class="footer-link"
								aria-label="Open Terms of Service modal"
							>
								Terms of Service
							</button>
						</li>
						<li>
							<a 
								href="mailto:aismartcvllc@gmail.com" 
								class="footer-link"
								aria-label="Contact customer support via email"
							>
								Customer Support
							</a>
						</li>
					</ul>
				</nav>

				<div class="footer-contact">
					<h4 class="contact-title">Contact Us</h4>
					<p class="contact-info">
						<a 
							href="mailto:aismartcvllc@gmail.com" 
							class="contact-email"
							aria-label="Send email to aismartcvllc@gmail.com"
						>
							aismartcvllc@gmail.com
						</a>
					</p>
				</div>
			</div>

			<div class="footer-bottom">
				<p class="copyright">&copy; {{ currentYear }} SmartCV. All rights reserved.</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { computed } from 'vue';
import { useCVAnalysisStore } from '../../stores/index.js';

const store = useCVAnalysisStore();

const currentYear = computed(() => new Date().getFullYear());

const openTermsModal = () => {
	store.openTermsModal();
};
</script>

<style scoped>
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
	width: 100%;
}

.footer {
	background: #333;
	color: white;
	padding: 50px 20px 30px;
	margin-top: auto;
}

.footer-content {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 40px;
	margin-bottom: 30px;
}

.footer-brand {
	text-align: left;
}

.brand-name {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 10px;
	color: white;
}

.brand-tagline {
	font-size: 0.9rem;
	color: #e0e0e0;
	line-height: 1.6;
}

.footer-links {
	text-align: left;
}

.links-title,
.contact-title {
	font-size: 1.1rem;
	font-weight: 600;
	margin-bottom: 15px;
	color: white;
}

.links-list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.links-list li {
	margin-bottom: 10px;
}

.footer-link {
	background: none;
	border: none;
	color: #e0e0e0;
	text-decoration: none;
	font-size: 0.95rem;
	cursor: pointer;
	transition: color 0.3s, outline 0.2s;
	padding: 4px 8px;
	margin: -4px -8px;
	border-radius: 4px;
	font-family: inherit;
}

.footer-link:hover {
	color: #667eea;
	text-decoration: underline;
}

.footer-link:focus {
	outline: 2px solid #667eea;
	outline-offset: 2px;
	color: #667eea;
}

.footer-contact {
	text-align: left;
}

.contact-info {
	margin: 0;
	color: #e0e0e0;
	font-size: 0.95rem;
}

.contact-email {
	color: #7c8ef5;
	text-decoration: none;
	transition: color 0.3s, outline 0.2s;
	padding: 2px 4px;
	margin: -2px -4px;
	border-radius: 4px;
}

.contact-email:hover {
	color: #9ba8ff;
	text-decoration: underline;
}

.contact-email:focus {
	outline: 2px solid #667eea;
	outline-offset: 2px;
	color: #9ba8ff;
}

.footer-bottom {
	border-top: 1px solid #555;
	padding-top: 20px;
	text-align: center;
}

.copyright {
	color: #b0b0b0;
	font-size: 0.9rem;
	margin: 0;
}

@media (max-width: 768px) {
	.footer-content {
		grid-template-columns: 1fr;
		gap: 30px;
		text-align: center;
	}

	.footer-brand,
	.footer-links,
	.footer-contact {
		text-align: center;
	}
}
</style>
