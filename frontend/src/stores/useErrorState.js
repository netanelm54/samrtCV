import { ref } from 'vue'

/**
 * Error state management composable
 * Contains error state and error actions
 */
export function useErrorState() {
  // Error State
  const error = ref('')

  // Error Actions
  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = ''
  }

  return {
    // State
    error,
    
    // Actions
    setError,
    clearError
  }
}

