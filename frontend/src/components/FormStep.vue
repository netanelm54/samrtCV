<template>
	<div class="cv-form">
		<div class="form-group">
			<label for="cv-file" class="form-label">
				Upload Your CV/Resume
				<span class="required">*</span>
			</label>
			<input
				id="cv-file"
				type="file"
				accept=".pdf,.docx"
				@change="handleFileChange"
				required
				class="form-input-file"
			/>
			<small class="form-hint">Accepted formats: PDF, DOCX (Max 10MB)</small>
			<div v-if="store.cvFile" class="file-info">Selected: {{ store.cvFile.name }}</div>
		</div>

		<div class="form-group">
			<label for="role" class="form-label">
				Role
				<span class="required">*</span>
			</label>
			<input
				id="role"
				:value="store.role"
				@input="store.setRole($event.target.value)"
				type="text"
				placeholder="e.g., Software Engineer, Product Manager"
				required
				class="form-input"
			/>
		</div>

		<div class="form-group">
			<label for="job-description" class="form-label"> Job Description </label>
			<textarea
				id="job-description"
				:value="store.jobDescription"
				@input="store.setJobDescription($event.target.value)"
				rows="8"
				placeholder="Paste the job description here (optional)..."
				class="form-textarea"
			></textarea>
		</div>

		<button type="button" @click="store.goToNextStep()" :disabled="!store.isFormValid" class="cta-button">
			Next
		</button>

		<div v-if="store.error" class="error-message">
			{{ store.error }}
		</div>
	</div>
</template>

<script setup>
import { useCVAnalysisStore } from '../stores/index.js';

const store = useCVAnalysisStore();

const handleFileChange = (event) => {
	const file = event.target.files[0];
	if (file) {
		if (file.size > 10 * 1024 * 1024) {
			store.setFileError('File size must be less than 10MB');
			return;
		}
		store.setCVFile(file);
	}
};
</script>

<style scoped>
.cv-form {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.form-label {
	font-weight: 600;
	color: #333;
	font-size: 0.95rem;
}

.required {
	color: #e74c3c;
}

.form-input,
.form-textarea {
	padding: 12px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 1rem;
	font-family: inherit;
	transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
	outline: none;
	border-color: #667eea;
}

.form-textarea {
	resize: vertical;
	min-height: 150px;
}

.form-input-file {
	padding: 12px;
	border: 2px dashed #e0e0e0;
	border-radius: 8px;
	cursor: pointer;
	transition: border-color 0.3s;
}

.form-input-file:hover {
	border-color: #667eea;
}

.form-hint {
	color: #666;
	font-size: 0.85rem;
}

.file-info {
	padding: 8px 12px;
	background: #f0f0f0;
	border-radius: 6px;
	font-size: 0.9rem;
	color: #333;
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
	margin-top: 10px;
}

.cta-button:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.cta-button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.error-message {
	padding: 12px;
	background: #fee;
	border: 1px solid #fcc;
	border-radius: 6px;
	color: #c33;
	font-size: 0.9rem;
}
</style>
