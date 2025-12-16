import { ref } from 'vue'

/**
 * Loading state management composable
 * Contains loading state and loading actions
 */
export function useLoadingState() {
  // Loading State
  const isLoading = ref(false)

  // Loading Actions
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const startLoading = () => {
    isLoading.value = true
  }

  const stopLoading = () => {
    isLoading.value = false
  }

  return {
    // State
    isLoading,
    
    // Actions
    setLoading,
    startLoading,
    stopLoading
  }
}

