import { ref } from 'vue'
import * as cvAnalysisApi from '../api/cvAnalysisApi.js'

/**
 * Composable for CV analysis functionality
 * Provides reactive state and methods for CV analysis operations
 */
export function useCVAnalysis() {
	const isLoading = ref(false)
	const error = ref('')

	/**
	 * Handles API errors and sets error message
	 */
	const handleError = (err) => {
		error.value = err.response?.data?.error || 'An error occurred. Please try again.'
		console.error('CV Analysis Error:', err)
	}

	/**
	 * Analyzes CV only and triggers download
	 * @param {File} cvFile - The CV file to analyze
	 * @param {string} role - The role/job title
	 * @param {string} jobDescription - Optional job description
	 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
	 */
	const analyzeOnly = async (cvFile, role, jobDescription = '') => {
		isLoading.value = true
		error.value = ''

		try {
			const result = await cvAnalysisApi.analyzeCVOnly(cvFile, role, jobDescription)
			const blob = new Blob([result.blob], { type: result.blobType })
			cvAnalysisApi.downloadFile(blob, result.filename)
			return true
		} catch (err) {
			handleError(err)
			return false
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * Improves CV only and triggers download
	 * @param {File} cvFile - The CV file to improve
	 * @param {string} role - The role/job title
	 * @param {string} jobDescription - Optional job description
	 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
	 */
	const improveOnly = async (cvFile, role, jobDescription = '') => {
		isLoading.value = true
		error.value = ''

		try {
			const result = await cvAnalysisApi.improveCVOnly(cvFile, role, jobDescription)
			const blob = new Blob([result.blob], { type: result.blobType })
			cvAnalysisApi.downloadFile(blob, result.filename)
			return true
		} catch (err) {
			handleError(err)
			return false
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * Complete package - analyzes and improves CV, then triggers download
	 * @param {File} cvFile - The CV file to process
	 * @param {string} role - The role/job title
	 * @param {string} jobDescription - Optional job description
	 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
	 */
	const analyzeAndImprove = async (cvFile, role, jobDescription = '') => {
		isLoading.value = true
		error.value = ''

		try {
			const result = await cvAnalysisApi.analyzeAndImproveCV(cvFile, role, jobDescription)
			const blob = new Blob([result.blob], { type: result.blobType })
			cvAnalysisApi.downloadFile(blob, result.filename)
			return true
		} catch (err) {
			handleError(err)
			return false
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * Processes CV based on selected option
	 * @param {string} option - The selected option: 'analysis', 'improved', or 'complete'
	 * @param {File} cvFile - The CV file to process
	 * @param {string} role - The role/job title
	 * @param {string} jobDescription - Optional job description
	 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
	 */
	const processCV = async (option, cvFile, role, jobDescription = '') => {
		if (!option) {
			error.value = 'Please select a service option'
			return false
		}

		switch (option) {
			case 'analysis':
				return await analyzeOnly(cvFile, role, jobDescription)
			case 'improved':
				return await improveOnly(cvFile, role, jobDescription)
			case 'complete':
				return await analyzeAndImprove(cvFile, role, jobDescription)
			default:
				error.value = 'Invalid service option'
				return false
		}
	}

	/**
	 * Clears the error state
	 */
	const clearError = () => {
		error.value = ''
	}

	return {
		isLoading,
		error,
		analyzeOnly,
		improveOnly,
		analyzeAndImprove,
		processCV,
		clearError
	}
}

