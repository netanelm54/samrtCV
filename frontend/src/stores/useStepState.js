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
    // Can proceed from step 1 (FormStep) if form is valid
    // Can proceed from step 2 (PreviewStep) always (no validation needed)
    return (isFormValid && isFormValid.value && currentStep.value === 1) || currentStep.value === 2
  })

  // Step Actions
  const goToNextStep = () => {
    if (currentStep.value === 1) {
      // From FormStep: validate form first
      if (isFormValid && isFormValid.value) {
        if (clearError) clearError()
        currentStep.value = 2 // Go to PreviewStep
      } else {
        if (setError) setError('Please fill in all required fields')
      }
    } else if (currentStep.value === 2) {
      // From PreviewStep: go to PricingStep
      if (clearError) clearError()
      currentStep.value = 3
    }
    // Step 3 (PricingStep) is the last step, no next step
  }

  const goToPreviousStep = () => {
    if (currentStep.value === 2) {
      // From PreviewStep: go back to FormStep
      currentStep.value = 1
      if (clearError) clearError()
    } else if (currentStep.value === 3) {
      // From PricingStep: go back to PreviewStep
      currentStep.value = 2
      if (clearError) clearError()
    }
    // Step 1 (FormStep) is the first step, can't go back further
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

