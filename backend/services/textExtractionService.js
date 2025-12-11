import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import fileAccessor from '../accessors/fileAccessor.js'

class TextExtractionService {
  /**
   * Extract text from PDF file
   * @param {string} filePath - Path to PDF file
   * @returns {Promise<string>} Extracted text
   */
  async extractFromPDF(filePath) {
    try {
      const dataBuffer = await fileAccessor.readFile(filePath)
      const data = await pdfParse(dataBuffer)
      return data.text
    } catch (error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`)
    }
  }

  /**
   * Extract text from DOCX file
   * @param {string} filePath - Path to DOCX file
   * @returns {Promise<string>} Extracted text
   */
  async extractFromDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath })
      return result.value
    } catch (error) {
      throw new Error(`Failed to extract text from DOCX: ${error.message}`)
    }
  }

  /**
   * Extract text from file based on extension
   * @param {string} filePath - Path to file
   * @param {string} fileExtension - File extension (.pdf, .docx)
   * @returns {Promise<string>} Extracted text
   */
  async extractText(filePath, fileExtension) {
    if (fileExtension === '.pdf') {
      return await this.extractFromPDF(filePath)
    } else if (fileExtension === '.docx') {
      return await this.extractFromDOCX(filePath)
    }
    throw new Error('Unsupported file type')
  }
}

export default new TextExtractionService()

