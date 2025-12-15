import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as cvAnalysisApi from '../api/cvAnalysisApi.js'

/**
 * Pinia store for CV Analysis state management
 * Manages form state, UI state, and API actions
 */
export const useCVAnalysisStore = defineStore('cvAnalysis', () => {
  // Form State
  const cvFile = ref(null)
  const role = ref('')
  const jobDescription = ref('')
  const selectedOption = ref(null)
  const termsAccepted = ref(false)

  // UI State
  const currentStep = ref(1)
  const showUpsell = ref(false)
  const showTermsModal = ref(false)
  const isLoading = ref(false)
  const error = ref('')

  // Computed Properties
  const isFormValid = computed(() => {
    return cvFile.value && role.value.trim()
  })

  const canProceedToNextStep = computed(() => {
    return isFormValid.value && currentStep.value === 1
  })

  const canSubmit = computed(() => {
    return selectedOption.value && termsAccepted.value && !isLoading.value
  })

  // Actions - Form Management
  const setCVFile = (file) => {
    cvFile.value = file
    clearError()
  }

  const setRole = (value) => {
    role.value = value
    clearError()
  }

  const setJobDescription = (value) => {
    jobDescription.value = value
  }

  const setSelectedOption = (option) => {
    selectedOption.value = option
    clearError()
  }

  const setTermsAccepted = (accepted) => {
    termsAccepted.value = accepted
  }

  const setFileError = (errorMessage) => {
    error.value = errorMessage
    cvFile.value = null
  }

  // Actions - Step Management
  const goToNextStep = () => {
    if (canProceedToNextStep.value) {
      clearError()
      currentStep.value = 2
    } else {
      error.value = 'Please fill in all required fields'
    }
  }

  const goToPreviousStep = () => {
    currentStep.value = 1
    clearError()
    termsAccepted.value = false
  }

  // Actions - Modal Management
  const showUpsellModal = () => {
    showUpsell.value = true
  }

  const hideUpsellModal = () => {
    showUpsell.value = false
  }

  const openTermsModal = () => {
    showTermsModal.value = true
  }

  const hideTermsModal = () => {
    showTermsModal.value = false
  }

  // Actions - Error Management
  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = ''
  }

  // Actions - API Calls
  const analyzeOnly = async () => {
    if (!cvFile.value || !role.value.trim()) {
      setError('Please fill in all required fields')
      return false
    }

    isLoading.value = true
    clearError()

    try {
      const result = await cvAnalysisApi.analyzeCVOnly(
        cvFile.value,
        role.value,
        jobDescription.value
      )
      const blob = new Blob([result.blob], { type: result.blobType })
      cvAnalysisApi.downloadFile(blob, result.filename)
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const improveOnly = async () => {
    if (!cvFile.value || !role.value.trim()) {
      setError('Please fill in all required fields')
      return false
    }

    isLoading.value = true
    clearError()

    try {
      const result = await cvAnalysisApi.improveCVOnly(
        cvFile.value,
        role.value,
        jobDescription.value
      )
      const blob = new Blob([result.blob], { type: result.blobType })
      cvAnalysisApi.downloadFile(blob, result.filename)
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const analyzeAndImprove = async () => {
    if (!cvFile.value || !role.value.trim()) {
      setError('Please fill in all required fields')
      return false
    }

    isLoading.value = true
    clearError()

    try {
      const result = await cvAnalysisApi.analyzeAndImproveCV(
        cvFile.value,
        role.value,
        jobDescription.value
      )
      const blob = new Blob([result.blob], { type: result.blobType })
      cvAnalysisApi.downloadFile(blob, result.filename)
      return true
    } catch (err) {
      handleApiError(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const processCV = async () => {
    if (!selectedOption.value) {
      setError('Please select a service option')
      return false
    }

    if (!termsAccepted.value) {
      setError('Please accept the terms of service')
      return false
    }

    switch (selectedOption.value) {
      case 'analysis':
        return await analyzeOnly()
      case 'improved':
        return await improveOnly()
      case 'complete':
        return await analyzeAndImprove()
      default:
        setError('Invalid service option')
        return false
    }
  }

  const handleUpsellPurchase = async () => {
    return await improveOnly()
  }

  // Actions - Reset/Reset Form
  const resetForm = () => {
    cvFile.value = null
    role.value = ''
    jobDescription.value = ''
    selectedOption.value = null
    termsAccepted.value = false
    currentStep.value = 1
    clearError()
    
    // Reset file input element if it exists
    const fileInput = document.getElementById('cv-file')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const resetAfterSuccess = () => {
    // Keep form data but reset UI state
    selectedOption.value = null
    termsAccepted.value = false
    currentStep.value = 1
    clearError()
    
    const fileInput = document.getElementById('cv-file')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // Helper Functions
  const handleApiError = (err) => {
    const errorMessage = err.response?.data?.error || 'An error occurred. Please try again.'
    setError(errorMessage)
    console.error('CV Analysis API Error:', err)
  }

  return {
    // State
    cvFile,
    role,
    jobDescription,
    selectedOption,
    termsAccepted,
    currentStep,
    showUpsell,
    showTermsModal,
    isLoading,
    error,
    
    // Computed
    isFormValid,
    canProceedToNextStep,
    canSubmit,
    
    // Form Actions
    setCVFile,
    setRole,
    setJobDescription,
    setSelectedOption,
    setTermsAccepted,
    setFileError,
    
    // Step Actions
    goToNextStep,
    goToPreviousStep,
    
    // Modal Actions
    showUpsellModal,
    hideUpsellModal,
    openTermsModal,
    hideTermsModal,
    
    // Error Actions
    setError,
    clearError,
    
    // API Actions
    analyzeOnly,
    improveOnly,
    analyzeAndImprove,
    processCV,
    handleUpsellPurchase,
    
    // Reset Actions
    resetForm,
    resetAfterSuccess
  }
})

