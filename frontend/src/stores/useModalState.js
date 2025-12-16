import { ref } from 'vue'

/**
 * Modal state management composable
 * Contains modal state and modal actions
 */
export function useModalState() {
  // Modal State
  const showUpsell = ref(false)
  const showTermsModal = ref(false)

  // Modal Actions
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

  return {
    // State
    showUpsell,
    showTermsModal,
    
    // Actions
    showUpsellModal,
    hideUpsellModal,
    openTermsModal,
    hideTermsModal
  }
}

