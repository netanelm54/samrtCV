import { ref, computed } from 'vue'

/**
 * Step management composable
 * Contains step state, computed properties, and step actions
 */
export function useStepState(isFormValid, clearError, setError) {
  // Step State
  const currentStep = ref(1)

  // Step Computed Properties
  const canProceedToNextStep = computed(() => {
    return isFormValid && isFormValid.value && currentStep.value === 1
  })

  // Step Actions
  const goToNextStep = () => {
    if (canProceedToNextStep.value) {
      if (clearError) clearError()
      currentStep.value = 2
    } else {
      if (setError) setError('Please fill in all required fields')
    }
  }

  const goToPreviousStep = () => {
    currentStep.value = 1
    if (clearError) clearError()
  }

  const resetStep = () => {
    currentStep.value = 1
  }

  return {
    // State
    currentStep,
    
    // Computed
    canProceedToNextStep,
    
    // Actions
    goToNextStep,
    goToPreviousStep,
    resetStep
  }
}

