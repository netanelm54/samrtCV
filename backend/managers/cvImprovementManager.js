import openaiAccessor from '../accessors/openaiAccessor.js'

class CVImprovementManager {
  /**
   * Generate improved CV based on analysis
   * @param {string} originalResumeText - Original CV text
   * @param {string} jobDescription - Job description
   * @param {Object} analysisData - Analysis results
   * @returns {Promise<Object>} Improved CV as structured JSON
   */
  async improveCV(originalResumeText, jobDescription, analysisData) {
    try {
      const improvedCVData = await openaiAccessor.improveCV(
        originalResumeText,
        jobDescription,
        analysisData
      )

      return {
        success: true,
        improvedCVData
      }
    } catch (error) {
      throw new Error(`CV Improvement failed: ${error.message}`)
    }
  }
}

export default new CVImprovementManager()

