<template>
	<BaseModal :show="show" size="large" @close="$emit('close')">
		<div class="terms-content">
			<h1 class="terms-title">Terms of Service</h1>
			<p class="terms-updated"><strong>Last Updated:</strong> {{ lastUpdated }}</p>

			<p>
				These Terms of Service ("Terms") govern your access to and use of the CV analysis,
				reporting, and CV improvement system (the "Service") operated by
				<strong>SmartCV</strong>. By accessing or using the Service, you agree to be bound
				by these Terms. If you do not agree, do not use the Service.
			</p>

			<section class="terms-section">
				<h2>1. Description of the Service</h2>
				<p>
					The Service is operated by <strong>SmartCV</strong> and uses
					<strong>artificial intelligence (AI)–based systems</strong> to analyze
					user-submitted curriculum vitae (CVs).
				</p>
				<p>The Service allows users to upload a CV and receive:</p>
				<ul>
					<li>An automated, AI-generated analysis and report regarding the CV; and</li>
					<li>
						Up to <strong>two improved CV versions</strong> generated using AI based on
						the information provided by the user.
					</li>
				</ul>
				<p>
					All outputs are generated automatically and may require human review and
					adjustment.
				</p>
				<p>The Service is provided for informational and assistance purposes only.</p>
			</section>

			<section class="terms-section">
				<h2>2. No Guarantee of Employment</h2>
				<p>
					The Service
					<strong
						>does not guarantee employment, interviews, job offers, career advancement,
						or any specific outcome</strong
					>. Hiring decisions are made solely by employers and depend on numerous factors
					beyond the Service's control.
				</p>
			</section>

			<section class="terms-section">
				<h2>3. Accuracy of Information</h2>
				<p>
					You are solely responsible for the accuracy, completeness, and legality of all
					information you provide.
				</p>
				<p>
					Any
					<strong>misrepresentation, fabrication, exaggeration, or falsification</strong>
					of skills, education, experience, certifications, dates, or other details is
					entirely the user's responsibility.
				</p>
				<p>
					The Service does not verify the truthfulness of the information submitted and
					assumes all provided content is accurate.
				</p>
			</section>

			<section class="terms-section">
				<h2>4. User Responsibility</h2>
				<p>You acknowledge and agree that:</p>
				<ul>
					<li>
						You are fully responsible for reviewing, editing, and approving any CV or
						report before use or submission.
					</li>
					<li>
						You assume all risks related to the use of the generated CVs and reports.
					</li>
					<li>
						You will ensure compliance with applicable laws, employer requirements, and
						ethical standards.
					</li>
				</ul>
			</section>

			<section class="terms-section">
				<h2>5. Payments, Fees, and Charges</h2>
				<ul>
					<li>
						The Service charges fees for CV reports, CV improvements, or related
						features, as presented at the time of purchase.
					</li>
					<li>All prices are displayed before payment and may change at any time.</li>
					<li>Payments are processed through third-party payment providers.</li>
					<li>
						<strong>All sales are final</strong>, unless otherwise required by
						applicable law.
					</li>
					<li>No refunds are provided for completed reports or generated CVs.</li>
				</ul>
			</section>

			<section class="terms-section">
				<h2>6. No Professional Advice</h2>
				<p>
					The Service uses AI and
					<strong
						>does not provide legal, financial, human resources, career coaching, or
						employment placement services</strong
					>.
				</p>
				<p>
					AI-generated outputs are not professional advice and should not be relied upon
					as such. Users should use their own judgment and, where appropriate, consult
					qualified professionals.
				</p>
			</section>

			<section class="terms-section">
				<h2>7. Intellectual Property</h2>
				<ul>
					<li>You retain ownership of the original content you submit.</li>
					<li>
						By using the Service, you grant a limited, non-exclusive license to process
						and transform your content solely for providing the Service.
					</li>
					<li>
						The structure, format, algorithms, and generated outputs of the Service are
						the intellectual property of the Service provider.
					</li>
				</ul>
			</section>

			<section class="terms-section">
				<h2>8. Limitation of Liability</h2>
				<p>
					To the maximum extent permitted by law, the Service, its AI systems, and its
					operators shall not be liable for:
				</p>
				<ul>
					<li>Any indirect, incidental, special, consequential, or punitive damages;</li>
					<li>Loss of employment opportunities, income, reputation, or business;</li>
					<li>
						Errors, omissions, hallucinations, bias, or inaccuracies in AI-generated
						reports or CVs;
					</li>
					<li>Reliance on AI-generated content.</li>
				</ul>
				<p>Your use of the Service and AI-generated outputs is at your sole risk.</p>
			</section>

			<section class="terms-section">
				<h2>9. Indemnification</h2>
				<p>
					You agree to <strong>indemnify, defend, and hold harmless</strong> the Service,
					its owners, employees, and affiliates from any claims, damages, losses,
					liabilities, costs, or expenses (including legal fees) arising from:
				</p>
				<ul>
					<li>Your use of the Service;</li>
					<li>Content you submit;</li>
					<li>Any misrepresentation or false information provided by you;</li>
					<li>Any violation of these Terms or applicable laws.</li>
				</ul>
			</section>

			<section class="terms-section">
				<h2>10. Data and Privacy</h2>
				<p>
					Use of the Service is also governed by our Privacy Policy. You acknowledge that
					uploaded CVs may contain personal data and consent to its processing solely for
					providing the Service.
				</p>
			</section>

			<section class="terms-section">
				<h2>11. Service Availability</h2>
				<p>
					We do not guarantee uninterrupted or error-free operation of the Service and
					reserve the right to modify, suspend, or discontinue the Service at any time.
				</p>
			</section>

			<section class="terms-section">
				<h2>12. Termination</h2>
				<p>
					We reserve the right to suspend or terminate access to the Service at our
					discretion, including in cases of misuse, fraud, or violation of these Terms.
				</p>
			</section>

			<section class="terms-section">
				<h2>13. Governing Law</h2>
				<p>
					These Terms shall be governed by and construed in accordance with the laws of
					[Insert Jurisdiction], without regard to conflict of law principles.
				</p>
			</section>

			<section class="terms-section">
				<h2>14. Changes to the Terms</h2>
				<p>
					We may update these Terms from time to time. Continued use of the Service after
					changes constitutes acceptance of the updated Terms.
				</p>
			</section>

			<section class="terms-section">
				<h2>15. Contact Information</h2>
				<p>For questions regarding these Terms, please contact:</p>
				<p>
					<strong>SmartCV</strong><br />
					[Insert Contact Email]
				</p>
			</section>

			<div class="terms-actions">
				<button @click="$emit('close')" class="terms-button">Close</button>
			</div>
		</div>
	</BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';

defineProps({
	show: {
		type: Boolean,
		default: false
	}
});

defineEmits(['close']);

const lastUpdated = new Date().toLocaleDateString('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric'
});
</script>

<style scoped>
.terms-content {
	max-height: 80vh;
	overflow-y: auto;
	padding: 20px 0;
}

.terms-title {
	font-size: 2rem;
	color: #333;
	margin-bottom: 10px;
}

.terms-updated {
	color: #666;
	font-size: 0.9rem;
	margin-bottom: 30px;
	padding-bottom: 20px;
	border-bottom: 1px solid #e0e0e0;
}

.terms-content p {
	color: #333;
	line-height: 1.8;
	margin-bottom: 15px;
}

.terms-section {
	margin-bottom: 30px;
}

.terms-section h2 {
	font-size: 1.3rem;
	color: #333;
	margin-bottom: 15px;
	margin-top: 25px;
}

.terms-section ul {
	margin: 15px 0;
	padding-left: 25px;
}

.terms-section li {
	color: #333;
	line-height: 1.8;
	margin-bottom: 10px;
}

.terms-section strong {
	color: #333;
	font-weight: 600;
}

.terms-actions {
	margin-top: 40px;
	padding-top: 20px;
	border-top: 1px solid #e0e0e0;
	text-align: center;
}

.terms-button {
	padding: 12px 32px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition:
		transform 0.2s,
		box-shadow 0.2s;
}

.terms-button:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Scrollbar styling */
.terms-content::-webkit-scrollbar {
	width: 8px;
}

.terms-content::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

.terms-content::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

.terms-content::-webkit-scrollbar-thumb:hover {
	background: #555;
}
</style>
