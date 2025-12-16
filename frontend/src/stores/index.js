import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useFormState } from './useFormState.js'
import { useStepState } from './useStepState.js'
import { useModalState } from './useModalState.js'
import { useErrorState } from './useErrorState.js'
import { useLoadingState } from './useLoadingState.js'
import { useApiActions } from './useApiActions.js'

/**
 * Main Pinia store for CV Analysis
 * Combines all state management composables
 */
export const useCVAnalysisStore = defineStore('cvAnalysis', () => {
  // Initialize error state first (needed by other composables)
  const errorState = useErrorState()
  const { error, setError, clearError } = errorState

  // Initialize loading state
  const loadingState = useLoadingState()
  const { isLoading, startLoading, stopLoading } = loadingState

  // Initialize form state (needs clearError)
  const formState = useFormState(clearError)
  const {
    cvFile,
    role,
    jobDescription,
    selectedOption,
    termsAccepted,
    isFormValid,
    setCVFile,
    setRole,
    setJobDescription,
    setSelectedOption,
    setTermsAccepted,
    setFileError: formSetFileError,
    resetFormFields,
    resetFileInput
  } = formState

  // Initialize step state (needs isFormValid, clearError, setError)
  const stepState = useStepState(isFormValid, clearError, setError)
  const { currentStep, canProceedToNextStep, goToNextStep, goToPreviousStep, resetStep } = stepState

  // Initialize modal state
  const modalState = useModalState()
  const {
    showUpsell,
    showTermsModal,
    showUpsellModal,
    hideUpsellModal,
    openTermsModal,
    hideTermsModal
  } = modalState

  // Initialize API actions (needs form state, loading, error)
  const apiActions = useApiActions(
    cvFile,
    role,
    jobDescription,
    selectedOption,
    termsAccepted,
    isLoading,
    setError,
    clearError,
    startLoading,
    stopLoading
  )
  const {
    analyzeOnly,
    improveOnly,
    analyzeAndImprove,
    processCV,
    handleUpsellPurchase
  } = apiActions

  // Global computed that depends on multiple states
  const canSubmit = computed(() => {
    return selectedOption.value && termsAccepted.value && !isLoading.value
  })

  // Enhanced setFileError that also sets error state
  const setFileError = (errorMessage) => {
    const message = formSetFileError(errorMessage)
    setError(message)
  }

  // Enhanced goToPreviousStep that resets terms
  const goToPreviousStepWithReset = () => {
    goToPreviousStep()
    termsAccepted.value = false
  }

  // Combined reset actions
  const resetForm = () => {
    resetFormFields()
    resetStep()
    clearError()
    resetFileInput()
  }

  const resetAfterSuccess = () => {
    // Keep form data but reset UI state
    selectedOption.value = null
    termsAccepted.value = false
    resetStep()
    clearError()
    resetFileInput()
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
    goToPreviousStep: goToPreviousStepWithReset,
    
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

