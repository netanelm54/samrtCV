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

      const { role, jobDescription } = req.body

      if (!role) {
        await fileAccessor.deleteFile(req.file.path)
        return res.status(400).json({ error: 'Role is required' })
      }

      // Use job description if provided, otherwise use role as context
      const analysisContext = jobDescription || `Role: ${role}`

      console.log('Processing CV analysis...')

      // Step 1: Analyze CV
      const analysisResult = await cvAnalysisManager.analyzeCV(
        req.file.path,
        analysisContext
      )

      // Step 2: Generate improved CV
      const improvementResult = await cvImprovementManager.improveCV(
        analysisResult.originalResumeText,
        analysisContext,
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

  /**
   * Process CV analysis only and return PDF report
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async analyzeOnly(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'CV file is required' })
      }

      const { role, jobDescription } = req.body

      if (!role) {
        await fileAccessor.deleteFile(req.file.path)
        return res.status(400).json({ error: 'Role is required' })
      }

      // Use job description if provided, otherwise use role as context
      const analysisContext = jobDescription || `Role: ${role}`

      console.log('Processing CV analysis only...')

      // Step 1: Analyze CV
      const analysisResult = await cvAnalysisManager.analyzeCV(
        req.file.path,
        analysisContext
      )

      // Step 2: Generate PDF report only
      const reportPDF = await pdfService.generateAnalysisReport(analysisResult.analysis)

      // Step 3: Clean up uploaded file
      await fileAccessor.deleteFile(req.file.path)

      // Return PDF file
      const timestamp = Date.now()
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="CV-Analysis-Report-${timestamp}.pdf"`)
      res.send(reportPDF)

      console.log('Analysis completed and PDF sent')
    } catch (error) {
      console.error('Error processing analysis:', error)
      if (req.file) {
        await fileAccessor.deleteFile(req.file.path)
      }
      res.status(500).json({ error: error.message })
    }
  }

  /**
   * Process CV improvement only and return improved CVs as zip
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async improveOnly(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'CV file is required' })
      }

      const { role, jobDescription } = req.body

      if (!role) {
        await fileAccessor.deleteFile(req.file.path)
        return res.status(400).json({ error: 'Role is required' })
      }

      // Use job description if provided, otherwise use role as context
      const analysisContext = jobDescription || `Role: ${role}`

      console.log('Processing CV improvement only...')

      // Step 1: Analyze CV (needed for improvement)
      const analysisResult = await cvAnalysisManager.analyzeCV(
        req.file.path,
        analysisContext
      )

      // Step 2: Generate improved CV
      const improvementResult = await cvImprovementManager.improveCV(
        analysisResult.originalResumeText,
        analysisContext,
        analysisResult.analysis
      )

      // Step 3: Generate PDFs - both templates
      const improvedCVPDFTemplate1 = await pdfService.generateImprovedCV(improvementResult.improvedCVData, 1)
      const improvedCVPDFTemplate2 = await pdfService.generateImprovedCV(improvementResult.improvedCVData, 2)

      // Step 4: Clean up uploaded file
      await fileAccessor.deleteFile(req.file.path)

      // Step 5: Create zip file with improved CVs
      const zip = new JSZip()
      const timestamp = Date.now()
      
      zip.file(`Your-Improved-CV-Template1-${timestamp}.pdf`, improvedCVPDFTemplate1)
      zip.file(`Your-Improved-CV-Template2-${timestamp}.pdf`, improvedCVPDFTemplate2)

      // Generate zip buffer
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

      // Return zip file
      res.setHeader('Content-Type', 'application/zip')
      res.setHeader('Content-Disposition', `attachment; filename="Improved-CV-${timestamp}.zip"`)
      res.send(zipBuffer)

      console.log('CV improvement completed and zip file sent')
    } catch (error) {
      console.error('Error processing CV improvement:', error)
      if (req.file) {
        await fileAccessor.deleteFile(req.file.path)
      }
      res.status(500).json({ error: error.message })
    }
  }
}

export default new AnalysisController()

