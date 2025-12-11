import cvAnalysisManager from '../managers/cvAnalysisManager.js'
import cvImprovementManager from '../managers/cvImprovementManager.js'
import pdfService from '../services/pdfService.js'
import fileAccessor from '../accessors/fileAccessor.js'
import JSZip from 'jszip'

class AnalysisController {
  /**
   * Process CV analysis and return both PDFs as zip
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async analyzeCVWithZip(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'CV file is required' })
      }

      const { jobDescription } = req.body

      if (!jobDescription) {
        await fileAccessor.deleteFile(req.file.path)
        return res.status(400).json({ error: 'Job description is required' })
      }

      console.log('Processing CV analysis...')

      // Step 1: Analyze CV
      const analysisResult = await cvAnalysisManager.analyzeCV(
        req.file.path,
        jobDescription
      )

      // Step 2: Generate improved CV
      const improvementResult = await cvImprovementManager.improveCV(
        analysisResult.originalResumeText,
        jobDescription,
        analysisResult.analysis
      )

      // Step 3: Generate PDFs - both templates
      const reportPDF = await pdfService.generateAnalysisReport(analysisResult.analysis)
      const improvedCVPDFTemplate1 = await pdfService.generateImprovedCV(improvementResult.improvedCVData, 1)
      const improvedCVPDFTemplate2 = await pdfService.generateImprovedCV(improvementResult.improvedCVData, 2)

      // Step 4: Clean up uploaded file
      await fileAccessor.deleteFile(req.file.path)

      // Step 5: Create zip file with all PDFs
      const zip = new JSZip()
      const timestamp = Date.now()
      
      zip.file(`CV-Analysis-Report-${timestamp}.pdf`, reportPDF)
      zip.file(`Your-Improved-CV-Template1-${timestamp}.pdf`, improvedCVPDFTemplate1)
      zip.file(`Your-Improved-CV-Template2-${timestamp}.pdf`, improvedCVPDFTemplate2)

      // Generate zip buffer
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

      // Return zip file
      res.setHeader('Content-Type', 'application/zip')
      res.setHeader('Content-Disposition', `attachment; filename="CV-Analysis-${timestamp}.zip"`)
      res.send(zipBuffer)

      console.log('Analysis completed and zip file sent')
    } catch (error) {
      console.error('Error processing analysis:', error)
      if (req.file) {
        await fileAccessor.deleteFile(req.file.path)
      }
      res.status(500).json({ error: error.message })
    }
  }
}

export default new AnalysisController()

