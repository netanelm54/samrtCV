<template>
  <div class="landing-page">
    <header class="hero-section">
      <div class="container">
        <h1 class="hero-title">AI Career Matcher</h1>
        <p class="hero-subtitle">Get expert analysis of your CV against any job description</p>
        <p class="hero-description">
          Our AI-powered system analyzes your resume and provides actionable insights to improve your match score
        </p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <div class="form-container">
          <h2 class="form-title">Get Your CV Analysis</h2>
          
          <!-- Step 1: Upload and Basic Info -->
          <div v-if="currentStep === 1" class="cv-form">
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
              <div v-if="cvFile" class="file-info">
                Selected: {{ cvFile.name }}
              </div>
            </div>

            <div class="form-group">
              <label for="role" class="form-label">
                Role
                <span class="required">*</span>
              </label>
              <input
                id="role"
                v-model="role"
                type="text"
                placeholder="e.g., Software Engineer, Product Manager"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="job-description" class="form-label">
                Job Description
              </label>
              <textarea
                id="job-description"
                v-model="jobDescription"
                rows="8"
                placeholder="Paste the job description here (optional)..."
                class="form-textarea"
              ></textarea>
            </div>

            <button
              type="button"
              @click="goToNextStep"
              :disabled="!isStep1Valid"
              class="cta-button"
            >
              Next
            </button>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </div>

          <!-- Step 2: Choose Service Option -->
          <div v-if="currentStep === 2" class="pricing-step">
            <h3 class="pricing-title">Choose Your Service</h3>
            <div class="pricing-options">
              <div 
                class="pricing-card"
                :class="{ selected: selectedOption === 'analysis' }"
                @click="selectOption('analysis')"
              >
                <div class="pricing-header">
                  <h4>Analysis Only</h4>
                  <div class="price">$5</div>
                </div>
                <p class="pricing-description">Get detailed CV analysis report</p>
                <ul class="pricing-features">
                  <li>✓ Match Score</li>
                  <li>✓ Missing Keywords</li>
                  <li>✓ Actionable Recommendations</li>
                </ul>
              </div>

              <div 
                class="pricing-card"
                :class="{ selected: selectedOption === 'improved' }"
                @click="selectOption('improved')"
              >
                <div class="popular-badge">Most Popular</div>
                <div class="pricing-header">
                  <h4>Improved CV</h4>
                  <div class="price">$18</div>
                </div>
                <p class="pricing-description">Get 2 improved CV templates</p>
                <ul class="pricing-features">
                  <li>✓ Traditional Classic Template</li>
                  <li>✓ Modern Minimalist Template</li>
                  <li>✓ Ready to send</li>
                </ul>
              </div>

              <div 
                class="pricing-card"
                :class="{ selected: selectedOption === 'complete' }"
                @click="selectOption('complete')"
              >
                <div class="best-value-badge">Best Value</div>
                <div class="pricing-header">
                  <h4>Complete Package</h4>
                  <div class="price">$20</div>
                </div>
                <p class="pricing-description">Get analysis report + 2 improved CV templates</p>
                <ul class="pricing-features">
                  <li>✓ Full Analysis Report</li>
                  <li>✓ Traditional Classic Template</li>
                  <li>✓ Modern Minimalist Template</li>
                  <li>✓ Best Value</li>
                </ul>
              </div>
            </div>

            <div class="step-actions">
              <button
                type="button"
                @click="goToPreviousStep"
                class="cta-button secondary"
              >
                Back
              </button>
              <button
                type="button"
                @click="handleSubmit"
                :disabled="!selectedOption || isLoading"
                class="cta-button"
              >
                <span v-if="isLoading">Processing...</span>
                <span v-else>Continue</span>
              </button>
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </div>
        </div>

        <div class="features-section">
          <h3 class="features-title">What You'll Get</h3>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h4>Match Score</h4>
              <p>See how well your CV matches the job description (0-100)</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h4>Missing Keywords</h4>
              <p>Identify critical keywords you should add to your CV</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h4>Actionable Fixes</h4>
              <p>Get specific recommendations to improve your resume</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💼</div>
              <h4>Interview Prep</h4>
              <p>Prepare for interviews with targeted questions</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">✨</div>
              <h4>Ready-to-Send CV</h4>
              <p>Get a professional, improved CV PDF ready to send to employers</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 AI Career Matcher. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const cvFile = ref(null)
const role = ref('')
const jobDescription = ref('')
const currentStep = ref(1)
const selectedOption = ref(null)
const isLoading = ref(false)
const error = ref('')

const isStep1Valid = computed(() => {
  return cvFile.value && role.value.trim()
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      error.value = 'File size must be less than 10MB'
      cvFile.value = null
      return
    }
    cvFile.value = file
    error.value = ''
  }
}

const goToNextStep = () => {
  if (isStep1Valid.value) {
    error.value = ''
    currentStep.value = 2
  } else {
    error.value = 'Please fill in all required fields'
  }
}

const goToPreviousStep = () => {
  currentStep.value = 1
  error.value = ''
}

const selectOption = (option) => {
  selectedOption.value = option
  error.value = ''
}

const handleSubmit = async () => {
  if (!selectedOption.value) {
    error.value = 'Please select a service option'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Create form data
    const formData = new FormData()
    formData.append('cv', cvFile.value)
    formData.append('role', role.value)
    if (jobDescription.value.trim()) {
      formData.append('jobDescription', jobDescription.value)
    }

    let endpoint = ''
    let filenamePrefix = ''
    let responseType = 'blob'
    let blobType = 'application/zip'
    let fileExtension = 'zip'

    if (selectedOption.value === 'analysis') {
      endpoint = '/api/analyze-only'
      filenamePrefix = 'CV-Analysis-Report'
      blobType = 'application/pdf'
      fileExtension = 'pdf'
    } else if (selectedOption.value === 'improved') {
      endpoint = '/api/improve-only'
      filenamePrefix = 'Improved-CV'
    } else if (selectedOption.value === 'complete') {
      endpoint = '/api/analyze-cv'
      filenamePrefix = 'CV-Complete-Package'
    }

    // Call appropriate endpoint
    const response = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: responseType
    })

    // Create download link
    const blob = new Blob([response.data], { type: blobType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filenamePrefix}-${Date.now()}.${fileExtension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Reset form
    cvFile.value = null
    role.value = ''
    jobDescription.value = ''
    selectedOption.value = null
    currentStep.value = 1
    if (document.getElementById('cv-file')) {
      document.getElementById('cv-file').value = ''
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'An error occurred. Please try again.'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.landing-page {
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

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-title {
  font-size: 3.5rem;
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
  transition: transform 0.2s, box-shadow 0.2s;
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

.pricing-step {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pricing-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.pricing-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.pricing-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  position: relative;
}

.pricing-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.pricing-card.selected {
  border-color: #667eea;
  background: #f8f9ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.best-value-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.pricing-header {
  margin-bottom: 20px;
}

.pricing-header h4 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.pricing-description {
  color: #666;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.pricing-features {
  list-style: none;
  padding: 0;
  text-align: left;
  color: #333;
}

.pricing-features li {
  padding: 8px 0;
  font-size: 0.9rem;
}

.step-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.cta-button.secondary {
  background: #e0e0e0;
  color: #333;
}

.cta-button.secondary:hover:not(:disabled) {
  background: #d0d0d0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-card h4 {
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.footer {
  background: #333;
  color: white;
  padding: 30px 20px;
  text-align: center;
  margin-top: auto;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .form-container {
    padding: 30px 20px;
  }

  .pricing-options {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>

