# Backend Architecture

## Project Structure

The backend follows a layered architecture pattern with clear separation of concerns:

```
backend/
├── accessors/          # External service access layer
│   ├── openaiAccessor.js    # OpenAI API interactions
│   └── fileAccessor.js      # File system operations
├── services/           # Business services
│   ├── textExtractionService.js  # PDF/DOCX text extraction
│   └── pdfService.js              # PDF generation
├── managers/           # Business logic layer
│   ├── cvAnalysisManager.js       # CV analysis orchestration
│   └── cvImprovementManager.js    # CV improvement orchestration
├── controllers/        # Request/response handling
│   └── analysisController.js      # Analysis endpoint controller
├── routes/             # Route definitions
│   └── analysisRoutes.js          # Analysis routes
├── utils/              # Utility functions
│   └── htmlEscape.js              # HTML escaping utility
└── server.js           # Application entry point
```

## Layer Responsibilities

### Accessors (`accessors/`)
**Purpose**: Direct interaction with external services and systems

- **openaiAccessor.js**: 
  - Handles all OpenAI API calls
  - Methods: `analyzeCV()`, `improveCV()`
  - Encapsulates API-specific logic

- **fileAccessor.js**:
  - File system operations
  - Methods: `readFile()`, `deleteFile()`, `getFileExtension()`, `ensureDirectory()`
  - Abstracts file operations

### Services (`services/`)
**Purpose**: Reusable business services

- **textExtractionService.js**:
  - Extracts text from PDF and DOCX files
  - Methods: `extractFromPDF()`, `extractFromDOCX()`, `extractText()`
  - Handles different file formats

- **pdfService.js**:
  - Generates PDF documents from data
  - Methods: `generateAnalysisReport()`, `generateImprovedCV()`, `htmlToPDF()`
  - Creates HTML templates and converts to PDF

### Managers (`managers/`)
**Purpose**: Business logic orchestration

- **cvAnalysisManager.js**:
  - Orchestrates CV analysis process
  - Coordinates text extraction and OpenAI analysis
  - Returns structured analysis results

- **cvImprovementManager.js**:
  - Orchestrates CV improvement process
  - Uses analysis results to generate improved CV
  - Returns improved CV text

### Controllers (`controllers/`)
**Purpose**: Handle HTTP requests and responses

- **analysisController.js**:
  - Handles `/api/analyze-cv` endpoint
  - Validates request data
  - Coordinates managers and services
  - Returns ZIP file with both PDFs

### Routes (`routes/`)
**Purpose**: Define API routes and middleware

- **analysisRoutes.js**:
  - Defines analysis routes
  - Configures multer for file uploads
  - Applies route-specific middleware

### Utils (`utils/`)
**Purpose**: Shared utility functions

- **htmlEscape.js**:
  - Escapes HTML special characters
  - Prevents XSS attacks

## Data Flow

1. **Request** → Routes (`analysisRoutes.js`)
2. **File Upload** → Multer middleware
3. **Controller** → `analysisController.analyzeCVWithZip()`
4. **Manager** → `cvAnalysisManager.analyzeCV()`
   - Uses `textExtractionService` to extract text
   - Uses `openaiAccessor` to analyze CV
5. **Manager** → `cvImprovementManager.improveCV()`
   - Uses `openaiAccessor` to generate improved CV
6. **Service** → `pdfService.generateAnalysisReport()`
7. **Service** → `pdfService.generateImprovedCV()`
8. **Controller** → Creates ZIP file with both PDFs
9. **Response** → Returns ZIP file to client

## Key Features

### Improved CV Generation
- Analyzes original CV against job description
- Identifies gaps and missing keywords
- Generates improved CV incorporating fixes
- Maintains original structure and factual accuracy

### Modular Architecture
- Easy to test individual components
- Clear separation of concerns
- Easy to extend with new features
- Maintainable codebase

### Error Handling
- Each layer handles its own errors
- Proper error propagation
- Cleanup of resources (file deletion)

## Adding New Features

To add a new feature:

1. **Accessor**: Add external service access in `accessors/`
2. **Service**: Add reusable services in `services/`
3. **Manager**: Add business logic in `managers/`
4. **Controller**: Add request handling in `controllers/`
5. **Routes**: Add route definitions in `routes/`

## Dependencies

- **express**: Web framework
- **multer**: File upload handling
- **openai**: OpenAI API client
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX text extraction
- **puppeteer**: HTML to PDF conversion
- **jszip**: ZIP file creation

