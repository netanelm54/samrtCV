import * as cvAnalysisApi from '../api/cvAnalysisApi.js'

/**
 * API actions composable
 * Contains all CV analysis API call actions
 */
export function useApiActions(
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
) {
  // Helper function for API error handling
  const handleApiError = (err) => {
    const errorMessage = err.response?.data?.error || 'An error occurred. Please try again.'
    if (setError) setError(errorMessage)
    console.error('CV Analysis API Error:', err)
  }

  // API Actions
  const analyzeOnly = async () => {
    if (!cvFile.value || !role.value.trim()) {
      if (setError) setError('Please fill in all required fields')
      return false
    }

    if (startLoading) startLoading()
    if (clearError) clearError()

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
      if (stopLoading) stopLoading()
    }
  }

  const improveOnly = async () => {
    if (!cvFile.value || !role.value.trim()) {
      if (setError) setError('Please fill in all required fields')
      return false
    }

    if (startLoading) startLoading()
    if (clearError) clearError()

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
      if (stopLoading) stopLoading()
    }
  }

  const analyzeAndImprove = async () => {
    if (!cvFile.value || !role.value.trim()) {
      if (setError) setError('Please fill in all required fields')
      return false
    }

    if (startLoading) startLoading()
    if (clearError) clearError()

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
      if (stopLoading) stopLoading()
    }
  }

  const processCV = async () => {
    if (!selectedOption.value) {
      if (setError) setError('Please select a service option')
      return false
    }

    if (!termsAccepted.value) {
      if (setError) setError('Please accept the terms of service')
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
        if (setError) setError('Invalid service option')
        return false
    }
  }

  const handleUpsellPurchase = async () => {
    return await improveOnly()
  }

  const getPreviewSummary = async () => {
    if (!cvFile.value || !role.value.trim()) {
      if (setError) setError('Please fill in all required fields')
      return null
    }

    if (startLoading) startLoading()
    if (clearError) clearError()

    try {
      const result = await cvAnalysisApi.getPreviewSummary(
        cvFile.value,
        role.value,
        jobDescription.value
      )
      return result
    } catch (err) {
      handleApiError(err)
      return null
    } finally {
      if (stopLoading) stopLoading()
    }
  }

  return {
    analyzeOnly,
    improveOnly,
    analyzeAndImprove,
    processCV,
    handleUpsellPurchase,
    getPreviewSummary
  }
}

