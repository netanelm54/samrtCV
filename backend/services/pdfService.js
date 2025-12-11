import puppeteer from 'puppeteer'
import { escapeHtml } from '../utils/htmlEscape.js'

class PDFService {
  /**
   * Generate PDF report from analysis data
   * @param {Object} analysisData - Analysis results
   * @returns {Promise<Buffer>} PDF buffer
   */
  async generateAnalysisReport(analysisData) {
    const htmlContent = this.createReportHTML(analysisData)
    return await this.htmlToPDF(htmlContent)
  }

  /**
   * Generate PDF from improved CV structured data
   * @param {Object} cvData - Improved CV data in structured format
   * @param {number} template - Template number (1 or 2), defaults to 1
   * @returns {Promise<Buffer>} PDF buffer
   */
  async generateImprovedCV(cvData, template = 1) {
    let htmlContent
    if (template === 2) {
      htmlContent = this.createCVHTMLTemplate2(cvData)
    } else {
      htmlContent = this.createCVHTMLTemplate1(cvData)
    }
    return await this.htmlToPDF(htmlContent)
  }

  /**
   * Convert HTML to PDF
   * @param {string} htmlContent - HTML content
   * @returns {Promise<Buffer>} PDF buffer
   */
  async htmlToPDF(htmlContent) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    try {
      const page = await browser.newPage()
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '15mm',
          right: '15mm',
          bottom: '15mm',
          left: '15mm'
        },
        printBackground: true,
        preferCSSPageSize: false
      })
      
      return pdfBuffer
    } finally {
      await browser.close()
    }
  }

  /**
   * Create HTML template for analysis report
   * @param {Object} analysisData - Analysis results
   * @returns {string} HTML content
   */
  createReportHTML(analysisData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      background: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #667eea;
    }
    .header h1 {
      color: #667eea;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .match-score {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 30px;
    }
    .match-score h2 {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .match-score p {
      font-size: 18px;
      opacity: 0.9;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e0e0e0;
    }
    .section-content {
      padding-left: 20px;
    }
    .summary-box {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      margin-bottom: 20px;
    }
    ul {
      list-style: none;
      padding-left: 0;
    }
    li {
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    li:last-child {
      border-bottom: none;
    }
    .keyword {
      display: inline-block;
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 20px;
      margin: 4px 4px 4px 0;
      font-size: 14px;
    }
    .question {
      background: #fff3e0;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      border-left: 4px solid #ff9800;
    }
    .question-number {
      font-weight: 700;
      color: #ff9800;
      margin-right: 8px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>CV Analysis Report</h1>
    <p>AI Career Matcher</p>
  </div>

  <div class="match-score">
    <h2>${analysisData.match_score}/100</h2>
    <p>Match Score</p>
  </div>

  <div class="section">
    <div class="section-title">Summary</div>
    <div class="summary-box">
      ${escapeHtml(analysisData.summary)}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Missing Keywords</div>
    <div class="section-content">
      ${analysisData.missing_keywords.map(kw => `<span class="keyword">${escapeHtml(kw)}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Critical Gaps</div>
    <ul class="section-content">
      ${analysisData.critical_gaps.map(gap => `<li>• ${escapeHtml(gap)}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Actionable Fixes</div>
    <ul class="section-content">
      ${analysisData.actionable_fixes.map(fix => `<li>• ${escapeHtml(fix)}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Interview Preparation Questions</div>
    <div class="section-content">
      ${analysisData.interview_prep_questions.map((q, i) => `
        <div class="question">
          <span class="question-number">Q${i + 1}:</span>${escapeHtml(q)}
        </div>
      `).join('')}
    </div>
  </div>

  <div class="footer">
    <p>Generated by AI Career Matcher | ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>
    `
  }

  /**
   * Create HTML template 1 (original single-column design) from structured CV data
   * @param {Object} cvData - Structured CV data
   * @returns {string} HTML content
   */
  createCVHTMLTemplate1(cvData) {
    // Build header
    let htmlContent = `<div class="cv-header">
      <h1 class="cv-name">${escapeHtml(cvData.full_name || '')}</h1>
      <div class="cv-contact">${escapeHtml(cvData.contact_info || '')}</div>
    </div>`

    // Professional Summary
    if (cvData.professional_summary) {
      htmlContent += `<div class="cv-section">
        <h2 class="section-title">Professional Summary</h2>
        <div class="section-content">
          <p class="summary-text">${escapeHtml(cvData.professional_summary)}</p>
        </div>
      </div>`
    }

    // Experience
    if (cvData.experience && cvData.experience.length > 0) {
      htmlContent += `<div class="cv-section">
        <h2 class="section-title">Professional Experience</h2>
        <div class="section-content">`
      
      cvData.experience.forEach(exp => {
        htmlContent += `<div class="experience-item">
          <div class="job-header">
            <span class="job-role">${escapeHtml(exp.role || '')}</span>
            <span class="job-company">${escapeHtml(exp.company || '')}</span>
            <span class="job-dates">${escapeHtml(exp.dates || '')}</span>
          </div>`
        
        if (exp.bullet_points && exp.bullet_points.length > 0) {
          htmlContent += `<ul class="job-bullets">`
          exp.bullet_points.forEach(bullet => {
            htmlContent += `<li>${escapeHtml(bullet)}</li>`
          })
          htmlContent += `</ul>`
        }
        
        htmlContent += `</div>`
      })
      
      htmlContent += `</div>
      </div>`
    }

    // Technical Skills
    if (cvData.technical_skills_list && cvData.technical_skills_list.length > 0) {
      htmlContent += `<div class="cv-section">
        <h2 class="section-title">Technical Skills</h2>
        <div class="section-content">
          <div class="skills-list">`
      cvData.technical_skills_list.forEach(skill => {
        htmlContent += `<span class="skill-category">${escapeHtml(skill)}</span>`
      })
      htmlContent += `</div>
        </div>
      </div>`
    }

    // Education
    if (cvData.education) {
      htmlContent += `<div class="cv-section">
        <h2 class="section-title">Education</h2>
        <div class="section-content">`
      
      // Split education by double newlines (between entries) or single newlines
      const educationEntries = cvData.education.split(/\n\s*\n/).filter(e => e.trim())
      
      educationEntries.forEach(entry => {
        const lines = entry.split('\n').filter(l => l.trim())
        if (lines.length > 0) {
          htmlContent += `<div class="education-item-template1">`
          lines.forEach((line, index) => {
            if (index === 0) {
              // First line is usually the degree name
              htmlContent += `<p class="education-degree">${escapeHtml(line)}</p>`
            } else {
              htmlContent += `<p class="education-detail">${escapeHtml(line)}</p>`
            }
          })
          htmlContent += `</div>`
        }
      })
      
      htmlContent += `</div>
      </div>`
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    @page {
      size: A4;
      margin: 0.5cm;
    }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 20px 30px;
      background: #fff;
      font-size: 11pt;
    }
    .cv-header {
      text-align: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #2c3e50;
    }
    .cv-name {
      font-size: 20pt;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }
    .cv-contact {
      font-size: 10pt;
      color: #555;
      margin-top: 4px;
    }
    .cv-section {
      margin-bottom: 15px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #34495e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section-content {
      margin-left: 0;
    }
    .summary-text {
      margin: 6px 0;
      text-align: left;
      line-height: 1.6;
      font-size: 11pt;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 6px 0;
    }
    .skill-category {
      background-color: #e8f4f8;
      color: #2c3e50;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 10pt;
      border: 1px solid #bdc3c7;
      white-space: nowrap;
    }
    .experience-item {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .job-role {
      font-weight: bold;
      font-size: 11pt;
      color: #2c3e50;
    }
    .job-company {
      font-weight: 600;
      color: #34495e;
      font-size: 10.5pt;
    }
    .job-dates {
      color: #666;
      font-size: 10pt;
      font-style: italic;
    }
    .job-bullets {
      margin-left: 20px;
      margin-top: 4px;
      padding-left: 0;
    }
    .job-bullets li {
      margin: 4px 0;
      line-height: 1.5;
      text-align: left;
      font-size: 10pt;
    }
    .section-content p {
      margin: 5px 0;
      text-align: left;
      font-size: 11pt;
    }
    .education-item-template1 {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .education-degree {
      font-weight: bold;
      margin-bottom: 3px !important;
      font-size: 11pt !important;
    }
    .education-detail {
      margin: 2px 0 !important;
      font-size: 10pt !important;
      color: #555;
    }
    @media print {
      body {
        padding: 15px 20px;
      }
      .cv-section {
        margin-bottom: 12px;
      }
      .experience-item {
        margin-bottom: 10px;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
    `
  }

  /**
   * Create HTML template 2 (two-column design) from structured CV data
   * @param {Object} cvData - Structured CV data
   * @returns {string} HTML content
   */
  createCVHTMLTemplate2(cvData) {
    // Parse contact info
    const contactInfo = cvData.contact_info || ''
    const phoneMatch = contactInfo.match(/[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}/)
    const emailMatch = contactInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const locationMatch = contactInfo.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/)
    
    const phone = phoneMatch ? phoneMatch[0] : ''
    const email = emailMatch ? emailMatch[0] : ''
    const location = locationMatch ? locationMatch[0] : contactInfo.replace(phone, '').replace(email, '').trim() || '#1 road, city/state-0011'
    
    // Extract title from professional summary or use default
    const title = cvData.title || 'Software Engineer'
    
    // Parse languages (if available in structured format)
    const languages = cvData.languages || []
    
    // Parse hobbies (if available)
    const hobbies = cvData.hobbies || []
    
    // Build left column (dark background)
    let leftColumn = `
      <div class="left-column">
        <div class="name-section">
          <h1 class="cv-name-left">${escapeHtml(cvData.full_name || 'Your Name')}</h1>
          <div class="cv-title-left">${escapeHtml(title)}</div>
        </div>
        
        <div class="left-section">
          <h2 class="left-section-title">CONTACT</h2>
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <span class="contact-text">${escapeHtml(phone || '+1 2345 6789')}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">✉️</span>
            <span class="contact-text">${escapeHtml(email || 'example@gmail.com')}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <span class="contact-text">${escapeHtml(location)}</span>
          </div>
        </div>
        
        <div class="left-section">
          <h2 class="left-section-title">SKILLS</h2>
          <ul class="left-list">`
    
    if (cvData.technical_skills_list && cvData.technical_skills_list.length > 0) {
      cvData.technical_skills_list.forEach(skill => {
        leftColumn += `<li>${escapeHtml(skill)}</li>`
      })
    } else {
      leftColumn += `<li>SQL Database Management</li>
        <li>Linux/Unix Command line</li>
        <li>Python</li>
        <li>C++</li>
        <li>JAVA</li>`
    }
    
    leftColumn += `</ul>
        </div>`
    
    // Languages section
    if (languages.length > 0) {
      leftColumn += `
        <div class="left-section">
          <h2 class="left-section-title">LANGUAGES</h2>
          <ul class="left-list">`
      languages.forEach(lang => {
        const langParts = lang.split(':')
        const langName = langParts[0] || lang
        const proficiency = langParts[1] ? langParts[1].trim() : 'Proficient'
        leftColumn += `<li>${escapeHtml(langName)}: ${escapeHtml(proficiency)}</li>`
      })
      leftColumn += `</ul>
        </div>`
    } else {
      leftColumn += `
        <div class="left-section">
          <h2 class="left-section-title">LANGUAGES</h2>
          <ul class="left-list">
            <li>English: Proficient</li>
            <li>Hindi: Proficient</li>
          </ul>
        </div>`
    }
    
     leftColumn += `
       </div>`
    
    // Build right column (white background)
    let rightColumn = `
      <div class="right-column">
        <div class="right-section">
          <h2 class="right-section-title">PROFILE</h2>
          <p class="profile-text">${escapeHtml(cvData.professional_summary || 'I am a software engineer with experience in a variety of programming languages and a track record of delivering high-quality code. I am skilled in problem-solving and have a strong background in computer science. I am a strong communicator and enjoy working collaboratively with others.')}</p>
        </div>`
    
    // Work Experience
    if (cvData.experience && cvData.experience.length > 0) {
      rightColumn += `
        <div class="right-section">
          <h2 class="right-section-title">WORK EXPERIENCE</h2>`
      
      cvData.experience.forEach(exp => {
        const role = exp.role || ''
        const company = exp.company || ''
        const dates = exp.dates || ''
        const companyLocation = company ? `${company} - Country` : 'Company - Country'
        
        rightColumn += `
          <div class="experience-item-right">
            <div class="job-header-right">
              <div class="job-title-right">
                <strong>${escapeHtml(role)}</strong>
                <div class="job-company-right">${escapeHtml(companyLocation)}</div>
              </div>
              <div class="job-dates-right">${escapeHtml(dates)}</div>
            </div>`
        
        if (exp.bullet_points && exp.bullet_points.length > 0) {
          rightColumn += `<ul class="job-bullets-right">`
          exp.bullet_points.forEach(bullet => {
            rightColumn += `<li>${escapeHtml(bullet)}</li>`
          })
          rightColumn += `</ul>`
        }
        
        rightColumn += `</div>`
      })
      
      rightColumn += `</div>`
    }
    
     // Education
     if (cvData.education) {
       rightColumn += `
         <div class="right-section">
           <h2 class="right-section-title">EDUCATION</h2>`
       
       // Split education by double newlines (between entries) or treat as single entry
       const educationEntries = cvData.education.split(/\n\s*\n/).filter(e => e.trim())
       
       educationEntries.forEach(entry => {
         const lines = entry.split('\n').filter(l => l.trim())
         
         if (lines.length > 0) {
           // First line is usually the degree name
           const degree = lines[0]
           // Try to find dates in the lines (look for year patterns or date ranges)
           const dateMatch = entry.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/) || 
                           entry.match(/\d{4}/)
           const dates = dateMatch ? dateMatch[0] : (lines.length > 1 && /^\d{4}/.test(lines[1]) ? lines[1] : '')
           // Last line or second-to-last if dates found is usually the university
           let university = ''
           if (lines.length > 1) {
             if (dateMatch && lines.length > 2) {
               university = lines.slice(2).join(' ')
             } else if (!dateMatch || lines.length === 2) {
               // If no date match or only 2 lines, second line might be university
               university = lines[1]
             } else {
               university = lines.slice(1).filter(l => l !== dates).join(' ')
             }
           }
           
           // Format as single line: Degree | Date | Institution
           const parts = [degree.trim()]
           if (dates) parts.push(dates.trim())
           if (university && university !== dates) parts.push(university.trim())
           
           rightColumn += `
             <div class="education-item-single-line">${escapeHtml(parts.join(' | '))}</div>`
         }
       })
       
       rightColumn += `</div>`
     } else {
       // Default education entries
       rightColumn += `
         <div class="right-section">
           <h2 class="right-section-title">EDUCATION</h2>
           <div class="education-item-single-line">Masters in Software Engineering | Jan 2019 - Dec 2020 | XYX University, Bangalore</div>
           <div class="education-item-single-line">Bachelor in Computer Science | Jan 2015 - Dec 2018 | XYX University, Bangalore</div>
         </div>`
     }
    
    rightColumn += `
      </div>`
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    @page {
      size: A4;
      margin: 0;
    }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      line-height: 1.5;
      color: #1a1a1a;
      background: #fff;
      font-size: 11pt;
      display: flex;
      min-height: 100vh;
    }
    .left-column {
      width: 33.33%;
      background-color: #2c3e50;
      color: #ffffff;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
    }
    .right-column {
      width: 66.67%;
      background-color: #ffffff;
      color: #000000;
      padding: 30px 25px;
      display: flex;
      flex-direction: column;
    }
    .name-section {
      margin-bottom: 30px;
      padding-top: 20px;
    }
    .cv-name-left {
      font-size: 24pt;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .cv-title-left {
      font-size: 12pt;
      color: #5dade2;
      margin-top: 5px;
    }
    .left-section {
      margin-bottom: 25px;
    }
    .left-section-title {
      font-size: 11pt;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #34495e;
      padding-bottom: 5px;
    }
    .contact-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      font-size: 10pt;
    }
    .contact-icon {
      color: #5dade2;
      margin-right: 10px;
      font-size: 12pt;
      width: 20px;
      flex-shrink: 0;
    }
    .contact-text {
      color: #ffffff;
      flex: 1;
    }
    .left-list {
      list-style: none;
      padding-left: 0;
    }
    .left-list li {
      color: #ffffff;
      font-size: 10pt;
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    .left-list li::before {
      content: '•';
      color: #5dade2;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    .right-section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .right-section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #000000;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-bottom: 5px;
      border-bottom: 1.5px solid #34495e;
    }
    .profile-text {
      font-size: 11pt;
      color: #000000;
      line-height: 1.6;
      text-align: justify;
    }
    .experience-item-right {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .job-header-right {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .job-title-right {
      flex: 1;
    }
    .job-title-right strong {
      font-size: 11pt;
      font-weight: bold;
      color: #000000;
      display: block;
      margin-bottom: 3px;
    }
    .job-company-right {
      font-size: 10pt;
      color: #000000;
      margin-top: 2px;
    }
    .job-dates-right {
      font-size: 10pt;
      color: #000000;
      white-space: nowrap;
      margin-left: 10px;
    }
    .job-bullets-right {
      margin-left: 20px;
      margin-top: 5px;
      padding-left: 0;
    }
    .job-bullets-right li {
      font-size: 10pt;
      color: #000000;
      margin-bottom: 4px;
      line-height: 1.5;
    }
     .education-item {
       margin-bottom: 15px;
     }
     .education-item strong {
       font-size: 11pt;
       font-weight: bold;
       color: #000000;
       display: block;
       margin-bottom: 3px;
     }
     .education-item div {
       font-size: 10pt;
       color: #000000;
       margin-top: 2px;
     }
     .education-item-single-line {
       font-size: 10pt;
       color: #000000;
       margin-bottom: 8px;
       line-height: 1.5;
     }
    @media print {
      body {
        display: flex;
      }
      .left-column,
      .right-column {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${leftColumn}
  ${rightColumn}
</body>
</html>
    `
  }

  /**
   * Create HTML template for improved CV (legacy method - kept for backward compatibility)
   * @param {string} cvText - CV text content
   * @returns {string} HTML content
   */
  createCVHTML(cvText) {
    const lines = cvText.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    let htmlContent = ''
    let currentSection = null
    let headerLines = []
    let sectionLines = []
    let isFirstSection = true
    
    // Process lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Detect section headers
      const sectionKeywords = ['PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE', 'EXPERIENCE', 
        'WORK EXPERIENCE', 'EDUCATION', 'SKILLS', 'TECHNICAL SKILLS', 'CERTIFICATIONS', 
        'PROJECTS', 'ACHIEVEMENTS', 'CONTACT', 'PROFESSIONAL EXPERIENCE']
      
      const isSectionHeader = (
        (line.length < 60 && line === line.toUpperCase() && line.length > 3 && 
         !line.includes('@') && !line.includes('•') && !line.includes('-')) ||
        (line.endsWith(':') && line.length < 50 && !line.includes('•')) ||
        sectionKeywords.some(keyword => {
          const upperLine = line.toUpperCase().replace(':', '').trim()
          return upperLine === keyword || (upperLine.includes(keyword) && line.length < 60)
        })
      )
      
      if (isSectionHeader) {
        // Save previous section
        if (currentSection) {
          htmlContent += this.renderSection(currentSection, sectionLines)
          sectionLines = []
        }
        
        // Start new section
        const sectionTitle = line.replace(':', '').trim()
        currentSection = sectionTitle
        isFirstSection = false
      } else {
        // Collect header lines (first 5-8 lines before any section)
        if (!currentSection && i < 8 && (line.includes('@') || line.includes('http') || 
            /[\d\-\(\)]/.test(line) || (line.length < 60 && !line.includes('•')))) {
          headerLines.push(line)
        } else {
          // Section content
          if (!currentSection) {
            currentSection = 'PROFESSIONAL SUMMARY'
          }
          sectionLines.push(line)
        }
      }
    }
    
    // Render header
    if (headerLines.length > 0) {
      htmlContent += this.renderHeader(headerLines)
    }
    
    // Render last section
    if (currentSection && sectionLines.length > 0) {
      htmlContent += this.renderSection(currentSection, sectionLines)
    }
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 25px 35px;
      background: #fff;
      font-size: 11pt;
    }
    .cv-header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #2c3e50;
    }
    .cv-name {
      font-size: 22pt;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }
    .cv-subtitle {
      font-size: 11pt;
      color: #555;
      margin-top: 4px;
      font-style: italic;
    }
    .cv-contact {
      font-size: 10pt;
      color: #555;
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 6px;
    }
    .cv-contact span {
      white-space: nowrap;
    }
    .cv-section {
      margin-bottom: 18px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #34495e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section-content {
      margin-left: 0;
    }
    .section-content p {
      margin: 5px 0;
      text-align: left;
    }
    .job-title {
      font-weight: bold;
      margin-top: 8px !important;
      margin-bottom: 4px !important;
    }
    .bullet-point {
      margin: 3px 0 3px 18px;
      padding-left: 4px;
      text-align: left;
      line-height: 1.4;
    }
    @media print {
      body {
        padding: 15px 20px;
      }
      .cv-section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
    `
  }

  /**
   * Render CV header
   * @param {Array<string>} headerLines - Header lines
   * @returns {string} HTML for header
   */
  renderHeader(headerLines) {
    const name = headerLines[0] || ''
    const contacts = headerLines.slice(1).filter(l => l.includes('@') || l.includes('http') || /[\d\-\(\)]/.test(l))
    const subtitle = headerLines.slice(1).find(l => !l.includes('@') && !l.includes('http') && !/[\d\-\(\)]/.test(l))
    
    let html = `<div class="cv-header">
      <h1 class="cv-name">${escapeHtml(name)}</h1>`
    
    if (subtitle) {
      html += `<div class="cv-subtitle">${escapeHtml(subtitle)}</div>`
    }
    
    if (contacts.length > 0) {
      html += `<div class="cv-contact">`
      contacts.forEach(contact => {
        html += `<span>${escapeHtml(contact)}</span>`
      })
      html += `</div>`
    }
    
    html += `</div>`
    return html
  }

  /**
   * Render CV section
   * @param {string} title - Section title
   * @param {Array<string>} lines - Section content lines
   * @returns {string} HTML for section
   */
  renderSection(title, lines) {
    let html = `<div class="cv-section">
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <div class="section-content">`
    
    lines.forEach(line => {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
        const bulletText = line.replace(/^[•\-\*]\s*/, '').replace(/^\d+\.\s*/, '')
        html += `<div class="bullet-point">• ${escapeHtml(bulletText)}</div>`
      } else if (line.length < 80 && (line.includes('|') || /^\d{4}/.test(line) || line.match(/^[A-Z][a-z]+ [A-Z]/))) {
        html += `<p class="job-title">${escapeHtml(line)}</p>`
      } else {
        html += `<p>${escapeHtml(line)}</p>`
      }
    })
    
    html += `</div></div>`
    return html
  }
}

export default new PDFService()

