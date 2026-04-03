# PDF Quiz Generator - Architecture Documentation

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Browser                                │
│                                                                  │
│  Next.js Frontend (React 18 + TypeScript)                        │
│  - Pages & Components                                            │
│  - Client-side state management (Zustand)                        │
│  - Form handling (React Hook Form)                               │
│  - Styling (Tailwind CSS + Framer Motion)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Next.js API Routes / Server Actions                 │
│                                                                  │
│  - Authentication Middleware (Clerk)                             │
│  - API Route Handlers (Node.js runtime)                          │
│  - PDF Processing & Text Extraction                              │
│  - AI Quiz Generation (OpenAI GPT-3.5)                           │
│  - Quiz Submission & Scoring Logic                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                              │
│                                                                  │
│  - OpenAI API (GPT-3.5 for quiz generation)                      │
│  - Clerk Auth (User authentication & management)                 │
│  - PostgreSQL (Primary database)                                 │
│  - PDF Processing Libraries (pdf-parse)                          │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Detailed Folder Structure

### `/src/app`
Next.js 14 App Router structure for pages and API routes.

```
app/
├── (auth)/                    # Auth layout group
│   ├── sign-in/               # Clerk sign-in page
│   └── sign-up/               # Clerk sign-up page
├── api/                       # API routes
│   ├── documents/
│   │   ├── upload/route.ts    # PDF upload handler
│   │   └── [documentId]/route.ts
│   ├── quizzes/
│   │   ├── generate/route.ts  # Quiz generation handler
│   │   └── [quizId]/route.ts
│   ├── quiz-attempts/
│   │   └── [attemptId]/route.ts
│   └── settings/route.ts      # User settings
├── dashboard/                 # Dashboard layout
│   ├── layout.tsx             # Sidebar + top bar
│   ├── page.tsx               # Main dashboard
│   ├── upload/                # PDF upload page
│   ├── quiz-generator/        # Quiz customization
│   ├── history/               # Past quizzes
│   ├── analytics/             # Performance charts
│   └── settings/              # User preferences
├── quiz/                      # Quiz taking
│   ├── [quizId]/page.tsx      # Quiz interface
│   └── results/               # Results & feedback
├── globals.css                # Global styles
├── layout.tsx                 # Root layout
└── page.tsx                   # Landing page
```

### `/src/components`
Reusable React components organized by feature.

```
components/
├── ui/                        # Reusable UI components
│   ├── Button.tsx             # Styled button
│   ├── Card.tsx               # Glass card component
│   ├── Input.tsx              # Form input
│   ├── Modal.tsx              # Modal dialog
│   ├── ProgressBar.tsx        # Progress indicator
│   └── Skeleton.tsx           # Loading skeleton
└── landing/                   # Landing page components
    └── LandingComponents.tsx  # Hero, features, CTA
```

### `/src/utils`
Business logic and utility functions.

```
utils/
├── pdf.ts                     # PDF extraction & processing
│   ├── extractPDFText()       # Main extraction function
│   ├── cleanText()            # Text normalization
│   ├── chunkText()            # Text chunking for LLM
│   └── extractKeywords()      # Keyword extraction
├── quiz-generator.ts          # AI quiz generation
│   ├── generateQuizQuestions()
│   ├── generateStudySummary()
│   └── extractMainTopics()
├── validation.ts              # Input validation
│   ├── validatePDFFile()
│   ├── validateQuizParams()
│   ├── formatFileSize()
│   └── calculateScorePercentage()
└── constants.ts               # App-wide constants
    ├── QUIZ_CONFIG
    ├── PDF_CONFIG
    ├── ROUTES
    └── ERROR_MESSAGES
```

### `/src/lib`
Library and integration code.

```
lib/
└── prisma.ts                  # Prisma Client singleton
    ├── Connection pooling
    ├── Logging configuration
    └── Type safety
```

### `/src/hooks`
Custom React hooks for state and effects.

```
hooks/
└── useToast.ts                # Toast notification hook
    ├── addToast()
    ├── removeToast()
    └── Type definitions
```

### `/src/store`
State management with Zustand.

```
store/
└── quizStore.ts               # Quiz state management
    ├── Quiz state
    ├── Question tracking
    ├── Answer storage
    └── Sessions
```

### `/prisma`
Database schema and migrations.

```
prisma/
├── schema.prisma              # Data model definitions
│   ├── User model
│   ├── Document model
│   ├── Quiz model
│   ├── Question model
│   ├── QuizAttempt model
│   ├── QuizAnswer model
│   └── AuditLog model
└── seed.ts                    # Sample data for development
```

## 🔄 Data Flow

### PDF Upload Flow
```
1. User selects PDF
   ↓
2. Frontend validation
   ↓
3. Create FormData with file
   ↓
4. POST /api/documents/upload
   ↓
5. Backend: Extract text from PDF
   ↓
6. Prisma: Create Document record
   ↓
7. Extract keywords & topics
   ↓
8. Return document ID
   ↓
9. Redirect to quiz-generator
```

### Quiz Generation Flow
```
1. User selects quiz parameters
   ↓
2. POST /api/quizzes/generate
   ↓
3. Fetch document from database
   ↓
4. Prepare LLM prompt with PDF content
   ↓
5. Call OpenAI API (GPT-3.5)
   ↓
6. Parse AI response into JSON
   ↓
7. Validate question data
   ↓
8. Prisma: Create Quiz & Questions
   ↓
9. Return quiz ID
   ↓
10. Redirect to /quiz/[quizId]
```

### Quiz Submission Flow
```
1. User completes quiz
   ↓
2. Click Submit Quiz
   ↓
3. POST /api/quizzes/[quizId]/submit
   ↓
4. Score calculation logic
   ↓
5. Create QuizAttempt record
   ↓
6. Create QuizAnswer for each question
   ↓
7. Calculate score percentage & analytics
   ↓
8. Return attempt ID
   ↓
9. Redirect to results page
```

## 🗄️ Database Schema

### Core Tables

**users**
- id (Primary Key)
- clerkId (Foreign Key to Clerk)
- email (Unique)
- name, avatar
- Relationships: documents, quizzes, attempts, settings

**documents**
- id (Primary Key)
- userId (Foreign Key)
- title, description
- fileSize, pageCount
- storagePath, extractedText
- keywords, mainTopics
- Relationships: quizzes

**quizzes**
- id (Primary Key)
- userId, documentId (Foreign Keys)
- title, description
- questionCount, difficulty, questionType
- Relationships: questions, attempts

**questions**
- id (Primary Key)
- quizId (Foreign Key)
- questionText, questionType
- options (JSON), correctAnswer
- explanation
- Relationships: answers

**quiz_attempts**
- id (Primary Key)
- userId, quizId (Foreign Keys)
- score, totalQuestions, correctAnswers
- timeTaken, mode
- Relationships: answers

**quiz_answers**
- id (Primary Key)
- attemptId, questionId (Foreign Keys)
- userAnswer, isCorrect

## 🔐 Authentication & Authorization

### Authentication Flow
```
User → Clerk Sign-in/Sign-up UI
  ↓
Clerk → Issues JWT tokens
  ↓
Next.js → Verifies JWT with @clerk/nextjs
  ↓
Middleware → Protects private routes
  ↓
API Routes → Auth guard with auth()
  ↓
Database → User lookup via Clerk ID
```

### Authorization Strategy
- Row-level security (RLS)
- Users can only access their own documents/quizzes
- API routes verify userId matches auth context

## 🎨 Design System

### Component Hierarchy
```
Page Component
├── Layout Wrapper
│   ├── Sidebar (Dashboard)
│   └── Top Bar (Navigation)
└── Content Area
    ├── Card
    │   ├── Typography
    │   └── UI Elements (Buttons, Inputs)
    └── Modal
        └── Form
```

### Styling Approach
- **Utility-First**: Tailwind CSS for styling
- **Theme**: Dark mode by default
- **Effects**: Custom Tailwind extensions
  - `.glass` - Glassmorphism effect
  - `.glass-dark` - Dark glass variant
  - Glow shadows for interactive elements

### Animation Strategy
- Framer Motion for complex animations
- Tailwind animation utilities for simple transitions
- Duration guidelines:
  - Fast: 200ms (micro interactions)
  - Normal: 300ms (page transitions)
  - Slow: 500ms+ (entrance animations)

## 🚀 Performance Optimization

### Frontend Optimization
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- CSS purging with Tailwind production build
- Lazy loading components
- Memoization with React.memo where needed

### Backend Optimization
- Prisma query optimization
- Database indexing on frequently queried fields
- Connection pooling
- API response compression
- Caching strategies for static content

### Database Optimization
- Indexes on foreign keys
- Composite indexes for common queries
- Pagination for large result sets
- Connection pool management

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Utility functions (validation, calculations)
- Store state management

### Integration Tests
- API endpoint flows
- Database operations
- Authentication flows

### E2E Tests
- Complete user journey (upload → quiz → results)
- Error handling scenarios
- Form validation

## 📈 Monitoring & Logging

### Application Logging
- TypeScript error types
- API error responses
- Database query logging (development)

### Performance Monitoring
- Page load metrics
- API response times
- Database query times

### Error Tracking
- Unhandled errors
- API failures
- Database errors

## 🔒 Security Considerations

### XSS Prevention
- React's built-in escaping
- Sanitization of user inputs
- Content Security Policy ready

### CSRF Protection
- Clerk handles session management
- SameSite cookies
- Next.js CSRF mitigation

### SQL Injection Prevention
- Prisma parameterized queries
- No raw SQL queries

### Authentication Security
- Clerk managed authentication
- Secure JWT tokens
- HTTP-only cookies

## 🌐 Deployment Considerations

### Environment Configuration
- Separate .env files for dev/staging/prod
- Secret management
- API key rotation

### Scaling
- Database connection pooling
- Stateless API design
- CDN ready for static assets
- Containerization with Docker

### Monitoring
- Error tracking integration
- Performance monitoring
- User analytics

## 📝 Code Standards

### Naming Conventions
- Components: PascalCase (Button, UserCard)
- Utilities: camelCase (formatFileSize)
- Constants: UPPER_SNAKE_CASE (MAX_FILE_SIZE)
- Folders: kebab-case (quiz-generator)

### File Organization
- One component per file
- Exports at end of file
- Imports alphabetically sorted
- Type definitions in separate files when needed

### Documentation
- JSDoc comments for functions
- Type annotations mandatory
- README per complex feature
- Inline comments for non-obvious logic

## 🎯 Future Architectural Improvements

- Microservices for PDF processing
- Message queue for async operations
- Caching layer (Redis)
- Search indexing (Elasticsearch)
- Real-time updates (WebSockets)
- Advanced analytics pipeline
- ML model improvements
