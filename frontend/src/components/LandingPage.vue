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
          <Step1Form
            v-if="currentStep === 1"
            :cv-file="cvFile"
            :role="role"
            :job-description="jobDescription"
            :error="error"
            @update:role="role = $event"
            @update:job-description="jobDescription = $event"
            @file-change="handleFileChange"
            @next="goToNextStep"
          />

          <!-- Step 2: Choose Service Option -->
          <Step2Pricing
            v-if="currentStep === 2"
            :selected-option="selectedOption"
            :is-loading="isLoading"
            :error="error"
            :terms-accepted="termsAccepted"
            @select-option="selectOption"
            @back="goToPreviousStep"
            @submit="handleSubmit"
            @update:terms-accepted="termsAccepted = $event"
            @show-terms="showTermsModal = true"
          />
        </div>

        <!-- Upsell Modal -->
        <UpsellModal
          :show="showUpsell"
          :is-loading="isLoading"
          :error="error"
          @close="closeUpsell"
          @purchase="handleUpsellPurchase"
        />

        <!-- Terms of Service Modal -->
        <TermsOfServiceModal
          :show="showTermsModal"
          @close="showTermsModal = false"
        />

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

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 AI Career Matcher. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import UpsellModal from './UpsellModal.vue'
import Step1Form from './Step1Form.vue'
import Step2Pricing from './Step2Pricing.vue'
import FeatureCard from './common/FeatureCard.vue'
import TermsOfServiceModal from './TermsOfServiceModal.vue'

const cvFile = ref(null)
const role = ref('')
const jobDescription = ref('')
const currentStep = ref(1)
const selectedOption = ref(null)
const isLoading = ref(false)
const error = ref('')
const showUpsell = ref(false)
const showTermsModal = ref(false)
const termsAccepted = ref(false)

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
  // {
  //   id: 4,
  //   icon: '💼',
  //   title: 'Interview Prep',
  //   description: 'Prepare for interviews with targeted questions'
  // },
  {
    id: 5,
    icon: '✨',
    title: 'Ready-to-Send CV',
    description: 'Get a professional, improved CV PDF ready to send to employers'
  }
])

const handleFileChange = ({ error: fileError, file }) => {
  if (fileError) {
    error.value = fileError
    cvFile.value = null
  } else {
    cvFile.value = file
    error.value = ''
  }
}

const goToNextStep = () => {
  if (cvFile.value && role.value.trim()) {
    error.value = ''
    currentStep.value = 2
  } else {
    error.value = 'Please fill in all required fields'
  }
}

const goToPreviousStep = () => {
  currentStep.value = 1
  error.value = ''
  termsAccepted.value = false
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

    // If analysis option was selected, show upsell modal
    if (selectedOption.value === 'analysis') {
      showUpsell.value = true
      isLoading.value = false
      return
    }

    // Reset form for other options
    cvFile.value = null
    role.value = ''
    jobDescription.value = ''
    selectedOption.value = null
    termsAccepted.value = false
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

const closeUpsell = () => {
  showUpsell.value = false
  // Reset form after closing upsell
  cvFile.value = null
  role.value = ''
  jobDescription.value = ''
  selectedOption.value = null
  termsAccepted.value = false
  currentStep.value = 1
  if (document.getElementById('cv-file')) {
    document.getElementById('cv-file').value = ''
  }
}

const handleUpsellPurchase = async () => {
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

    // Call improve-only endpoint
    const response = await axios.post('/api/improve-only', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    })

    // Create download link
    const blob = new Blob([response.data], { type: 'application/zip' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Improved-CV-${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Close upsell and reset form
    closeUpsell()
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

