import apiClient from './axiosConfig.js'

/**
 * API service for CV analysis endpoints
 * Handles all CV analysis related API calls
 */

/**
 * Creates FormData from CV analysis parameters
 */
const createFormData = (cvFile, role, jobDescription) => {
	const formData = new FormData()
	formData.append('cv', cvFile)
	formData.append('role', role)
	if (jobDescription?.trim()) {
		formData.append('jobDescription', jobDescription)
	}
	return formData
}

/**
 * Validates CV file before upload
 */
const validateCVFile = (file) => {
	if (!file) {
		throw new Error('Please select a CV file')
	}

	const maxSize = 10 * 1024 * 1024 // 10MB
	if (file.size > maxSize) {
		throw new Error('File size must be less than 10MB')
	}

	const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
	if (!allowedTypes.includes(file.type)) {
		throw new Error('Only PDF and DOCX files are allowed')
	}

	return true
}

/**
 * Validates form data before API call
 */
const validateFormData = (cvFile, role) => {
	validateCVFile(cvFile)

	if (!role || !role.trim()) {
		throw new Error('Please enter a role/job title')
	}

	return true
}

/**
 * Downloads a file from blob response
 */
export const downloadFile = (blob, filename) => {
	const url = window.URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = filename
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	window.URL.revokeObjectURL(url)
}

/**
 * Analyze CV only - returns PDF report
 */
export const analyzeCVOnly = async (cvFile, role, jobDescription = '') => {
	validateFormData(cvFile, role)

	const formData = createFormData(cvFile, role, jobDescription)

	const response = await apiClient.post('/api/analyze-only', formData, {
		responseType: 'blob'
	})

	return {
		blob: response.data,
		blobType: 'application/pdf',
		filename: `CV-Analysis-Report-${Date.now()}.pdf`
	}
}

/**
 * Improve CV only - returns ZIP file with improved CVs
 */
export const improveCVOnly = async (cvFile, role, jobDescription = '') => {
	validateFormData(cvFile, role)

	const formData = createFormData(cvFile, role, jobDescription)

	const response = await apiClient.post('/api/improve-only', formData, {
		responseType: 'blob'
	})

	return {
		blob: response.data,
		blobType: 'application/zip',
		filename: `Improved-CV-${Date.now()}.zip`
	}
}

/**
 * Complete package - analyze and improve CV - returns ZIP file
 */
export const analyzeAndImproveCV = async (cvFile, role, jobDescription = '') => {
	validateFormData(cvFile, role)

	const formData = createFormData(cvFile, role, jobDescription)

	const response = await apiClient.post('/api/analyze-cv', formData, {
		responseType: 'blob'
	})

	return {
		blob: response.data,
		blobType: 'application/zip',
		filename: `CV-Complete-Package-${Date.now()}.zip`
	}
}

