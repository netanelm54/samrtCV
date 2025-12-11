import openaiAccessor from '../accessors/openaiAccessor.js'
import textExtractionService from '../services/textExtractionService.js'
import fileAccessor from '../accessors/fileAccessor.js'

class CVAnalysisManager {
  /**
   * Analyze CV against job description
   * @param {string} cvFilePath - Path to CV file
   * @param {string} jobDescription - Job description text
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeCV(cvFilePath, jobDescription) {
    try {
      // Extract text from CV
      const fileExtension = fileAccessor.getFileExtension(cvFilePath)
      const resumeText = await textExtractionService.extractText(cvFilePath, fileExtension)

      // Analyze with OpenAI
      const analysisData = await openaiAccessor.analyzeCV(resumeText, jobDescription)

      return {
        success: true,
        analysis: analysisData,
        originalResumeText: resumeText
      }
    } catch (error) {
      throw new Error(`CV Analysis failed: ${error.message}`)
    }
  }
}

export default new CVAnalysisManager()

