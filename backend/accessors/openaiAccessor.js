import OpenAI from 'openai'

class OpenAIAccessor {
  constructor() {
    this._client = null
    this.model = process.env.OPENAI_MODEL || 'gpt-4o'
  }

  /**
   * Get OpenAI client instance (lazy initialization)
   * @returns {OpenAI} OpenAI client
   */
  get client() {
    if (!this._client) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is not set')
      }
      this._client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }
    return this._client
  }

  /**
   * Analyze CV against job description
   * @param {string} resumeText - Extracted text from CV
   * @param {string} jobDescription - Job description text
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeCV(resumeText, jobDescription) {
    const systemPrompt = "You are an expert Senior Technical Recruiter and ATS Specialist. You analyze resumes specifically for high-tech roles."

    const userPrompt = `Here is a candidate's Resume text: ${resumeText}

Here is the target Job Description (JD): ${jobDescription}

Analyze the fit between the Resume and the JD. Output a JSON object with the following strict structure:

{
  "match_score": "(integer 0-100)",
  "summary": "(A 2-sentence summary of the fit)",
  "missing_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "critical_gaps": [
    "Gap 1: Explanation...",
    "Gap 2: Explanation..."
  ],
  "actionable_fixes": [
    "Fix 1: Change X to Y...",
    "Fix 2: Rewrite section Z..."
  ],
  "interview_prep_questions": [
    "Question 1 (Based on weak points)",
    "Question 2 (Based on JD requirements)"
  ]
}`

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })

      const responseText = completion.choices[0].message.content
      return JSON.parse(responseText)
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`)
    }
  }

  /**
   * Generate improved CV based on analysis
   * @param {string} originalResumeText - Original CV text
   * @param {string} jobDescription - Job description
   * @param {Object} analysisData - Analysis results with gaps and fixes
   * @returns {Promise<Object>} Improved CV as structured JSON
   */
  async improveCV(originalResumeText, jobDescription, analysisData) {
    const systemPrompt = "You are an expert CV writer and career advisor specializing in high-tech roles. You create professional, ATS-friendly resumes that perfectly match job descriptions while maintaining authenticity and accuracy. Always output valid JSON."

    const userPrompt = `Here is the candidate's original Resume text:
${originalResumeText}

Here is the target Job Description:
${jobDescription}

Here is the analysis of gaps and issues:
- Missing Keywords: ${analysisData.missing_keywords.join(', ')}
- Critical Gaps: ${analysisData.critical_gaps.join('\n')}
- Actionable Fixes: ${analysisData.actionable_fixes.join('\n')}

Create an improved CV that:
1. Incorporates ALL missing keywords naturally throughout the document
2. Addresses ALL critical gaps identified
3. Applies ALL actionable fixes
4. Uses action verbs and quantifiable achievements
5. Keeps ALL factual information accurate (dates, company names, job titles)
6. Optimizes content to match the job description requirements

Output the improved CV as a JSON object with this EXACT structure:
{
  "full_name": "String (extract from original CV)",
  "contact_info": "String (Email | Phone | LinkedIn) - extract from original CV",
  "professional_summary": "A sharp, 3-sentence technical summary highlighting the stack and experience relevant to the JD. Incorporate missing keywords naturally.",
  "technical_skills_list": [
    "JavaScript",
    "Python",
    "AWS",
    "React",
    "Node.js",
    "Docker",
    "Vue.js"
  ],
  "experience": [
    {
      "company": "String (from original CV)",
      "role": "String (from original CV)",
      "dates": "String (from original CV)",
      "bullet_points": [
        "Action Verb + Task + Result/Metric + Keyword from JD",
        "Action Verb + Task + Result/Metric",
        "Action Verb + Task + Result/Metric"
      ]
    }
    // Include all experience entries from original CV, optimized
  ],
  "education": "String (from original CV, keep accurate). If multiple education entries, separate each entry with a newline character (\\n). Format: 'Degree Name | Dates | University Name\\nNext Degree Name | Dates | University Name'"
}

IMPORTANT FORMATTING RULES:
- technical_skills_list: List individual skills as separate strings. Each skill should be a single string (e.g., "JavaScript", "AWS", "Vue.js", "Python"). Do NOT include category prefixes. Prioritize skills mentioned in the job description and missing keywords from analysis.
- bullet_points: Each bullet MUST follow format: "Action Verb + Task + Result/Metric + Keyword from JD"
- Use strong action verbs: Developed, Implemented, Optimized, Led, Designed, etc.
- Include quantifiable metrics: percentages, numbers, timeframes
- Incorporate missing keywords from analysis naturally

IMPORTANT: 
- Keep all factual information accurate (company names, dates, job titles)
- Extract contact info from original CV
- Optimize bullet points to include missing keywords and address gaps
- Make summary powerful and tailored to the JD
- Skills list should prioritize missing keywords from analysis
- Output ONLY valid JSON, no additional text`

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 4000
      })

      const responseText = completion.choices[0].message.content
      return JSON.parse(responseText)
    } catch (error) {
      throw new Error(`OpenAI API error (CV improvement): ${error.message}`)
    }
  }
}

export default new OpenAIAccessor()

