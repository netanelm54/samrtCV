/**
 * Utility functions for persisting form data to localStorage
 * Handles File objects by converting them to base64 strings
 */

const STORAGE_KEY = 'cvAnalysisFormData'

/**
 * Convert File object to base64 string
 * @param {File} file - File object to convert
 * @returns {Promise<string>} Base64 encoded string
 */
const fileToBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			// reader.result is a data URL like "data:application/pdf;base64,..."
			// Extract just the base64 part
			const base64 = reader.result.split(',')[1]
			resolve({
				data: base64,
				type: file.type,
				name: file.name,
				size: file.size
			})
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

/**
 * Convert base64 string back to File object
 * @param {Object} fileData - Object containing base64 data, type, name, size
 * @returns {File} File object
 */
const base64ToFile = ({ data, type, name, size }) => {
	// Convert base64 to binary
	const binaryString = atob(data)
	const bytes = new Uint8Array(binaryString.length)
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i)
	}
	const blob = new Blob([bytes], { type })
	return new File([blob], name, { type })
}

/**
 * Save form data to localStorage
 * @param {Object} formData - Form data object containing cvFile, role, jobDescription, selectedOption
 */
export const saveFormData = async (formData) => {
	try {
		const { cvFile, role, jobDescription, selectedOption } = formData
		
		const dataToSave = {
			role: role || '',
			jobDescription: jobDescription || '',
			selectedOption: selectedOption || null,
			timestamp: Date.now()
		}

		// Convert file to base64 if present
		if (cvFile && cvFile instanceof File) {
			dataToSave.cvFile = await fileToBase64(cvFile)
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
		console.log('Form data saved to localStorage')
	} catch (error) {
		console.error('Error saving form data to localStorage:', error)
		throw error
	}
}

/**
 * Restore form data from localStorage
 * @returns {Object|null} Form data object or null if not found/expired
 */
export const restoreFormData = () => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (!stored) {
			return null
		}

		const data = JSON.parse(stored)
		
		// Check if data is expired (older than 1 hour)
		const oneHour = 60 * 60 * 1000
		if (Date.now() - data.timestamp > oneHour) {
			console.log('Stored form data expired, clearing...')
			clearFormData()
			return null
		}

		const restored = {
			role: data.role || '',
			jobDescription: data.jobDescription || '',
			selectedOption: data.selectedOption || null
		}

		// Convert base64 back to File if present
		if (data.cvFile) {
			restored.cvFile = base64ToFile(data.cvFile)
		}

		console.log('Form data restored from localStorage')
		return restored
	} catch (error) {
		console.error('Error restoring form data from localStorage:', error)
		clearFormData()
		return null
	}
}

/**
 * Clear form data from localStorage
 */
export const clearFormData = () => {
	try {
		localStorage.removeItem(STORAGE_KEY)
		console.log('Form data cleared from localStorage')
	} catch (error) {
		console.error('Error clearing form data from localStorage:', error)
	}
}

/**
 * Check if form data exists in localStorage
 * @returns {boolean} True if form data exists
 */
export const hasStoredFormData = () => {
	return localStorage.getItem(STORAGE_KEY) !== null
}
