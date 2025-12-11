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
          <form @submit.prevent="handleSubmit" class="cv-form">
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
              <label for="job-description" class="form-label">
                Job Description
                <span class="required">*</span>
              </label>
              <textarea
                id="job-description"
                v-model="jobDescription"
                rows="8"
                placeholder="Paste the job description here..."
                required
                class="form-textarea"
              ></textarea>
            </div>

            <!-- Email field commented out - not required for direct download -->
            <!-- <div class="form-group">
              <label for="email" class="form-label">
                Email Address
                <span class="required">*</span>
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="your.email@example.com"
                required
                class="form-input"
              />
              <small class="form-hint">We'll send your analysis report to this email</small>
            </div> -->

            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="cta-button"
            >
              <span v-if="isLoading">Processing...</span>
              <span v-else>Get Analysis & Your Improved CV</span>
            </button>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </form>
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
// import { loadStripe } from '@stripe/stripe-js' // COMMENTED OUT - Payment disabled

const cvFile = ref(null)
const jobDescription = ref('')
const email = ref('') // Not required anymore, but keeping for future use
const isLoading = ref(false)
const error = ref('')
// const price = ref(29.99) // COMMENTED OUT - Payment disabled

const isFormValid = computed(() => {
  return cvFile.value && jobDescription.value.trim()
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

const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Create form data
    const formData = new FormData()
    formData.append('cv', cvFile.value)
    formData.append('jobDescription', jobDescription.value)

    // Call analysis endpoint and download ZIP file
    const response = await axios.post('/api/analyze-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob' // Important for file download
    })

    // Create download link for ZIP file (contains both report and improved CV)
    const blob = new Blob([response.data], { type: 'application/zip' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `CV-Analysis-${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Reset form
    cvFile.value = null
    jobDescription.value = ''
    email.value = ''
    document.getElementById('cv-file').value = ''
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

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>

