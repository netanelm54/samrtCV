import { ref, computed } from 'vue'

/**
 * Form state management composable
 * Contains form state, computed properties, and form actions
 */
export function useFormState(clearError) {
  // Form State
  const cvFile = ref(null)
  const role = ref('')
  const jobDescription = ref('')
  const selectedOption = ref(null)
  const termsAccepted = ref(false)

  // Form Computed Properties
  const isFormValid = computed(() => {
    return cvFile.value && role.value.trim()
  })

  // Form Actions
  const setCVFile = (file) => {
    cvFile.value = file
    if (clearError) clearError()
  }

  const setRole = (value) => {
    role.value = value
    if (clearError) clearError()
  }

  const setJobDescription = (value) => {
    jobDescription.value = value
  }

  const setSelectedOption = (option) => {
    selectedOption.value = option
    if (clearError) clearError()
  }

  const setTermsAccepted = (accepted) => {
    termsAccepted.value = accepted
  }

  const setFileError = (errorMessage) => {
    cvFile.value = null
    return errorMessage
  }

  const resetFormFields = () => {
    cvFile.value = null
    role.value = ''
    jobDescription.value = ''
    selectedOption.value = null
    termsAccepted.value = false
  }

  const resetFileInput = () => {
    const fileInput = document.getElementById('cv-file')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return {
    // State
    cvFile,
    role,
    jobDescription,
    selectedOption,
    termsAccepted,
    
    // Computed
    isFormValid,
    
    // Actions
    setCVFile,
    setRole,
    setJobDescription,
    setSelectedOption,
    setTermsAccepted,
    setFileError,
    resetFormFields,
    resetFileInput
  }
}

