import fs from 'fs/promises'
import path from 'path'

class FileAccessor {
  /**
   * Read file from path
   * @param {string} filePath - Path to file
   * @returns {Promise<Buffer>} File buffer
   */
  async readFile(filePath) {
    try {
      return await fs.readFile(filePath)
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`)
    }
  }

  /**
   * Delete file
   * @param {string} filePath - Path to file
   */
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      // Ignore errors if file doesn't exist
      console.error('Error deleting file:', error.message)
    }
  }

  /**
   * Get file extension
   * @param {string} filePath - Path to file
   * @returns {string} File extension (lowercase)
   */
  getFileExtension(filePath) {
    return path.extname(filePath).toLowerCase()
  }

  /**
   * Create directory if it doesn't exist
   * @param {string} dirPath - Directory path
   */
  async ensureDirectory(dirPath) {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

export default new FileAccessor()

