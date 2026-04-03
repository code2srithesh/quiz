# PDF Quiz Generator - AI-Powered Interactive Quiz Creation

Transform any PDF document into engaging, interactive quizzes using AI. Built with modern technologies for both learning and teaching.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-active-success)

## 🎯 Features

### Core Features
- **📄 Smart PDF Upload** - Seamless drag-and-drop PDF processing with validation and preview
- **🧠 AI-Powered Quiz Generation** - Intelligent question generation using OpenAI GPT-3.5
- **🎮 Interactive Quiz Interface** - Beautiful, responsive quiz taking experience
- **📊 Rich Analytics** - Score trends, performance breakdowns, and learning insights
- **💾 Quiz History** - Track all past quizzes and attempts
- **⚙️ Customizable Settings** - Personalize your learning preferences

### Quiz Modes & Types
- **Question Types**: MCQ, True/False, Short Answer, Mixed
- **Difficulty Levels**: Easy, Medium, Hard, Mixed
- **Question Counts**: 5, 10, 15, 20 configurable
- **Quiz Modes**: Normal, Exam (timed), Revision

### Premium UX Features
- ✨ Glassmorphism design with iOS-inspired aesthetics
- 🎨 Dark futuristic theme with gradient accents
- 🌊 Smooth animations and micro-interactions
- 📱 Fully responsive mobile-first design
- ♿ Keyboard accessible and semantic HTML
- 🚀 Optimized performance and fast load times

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Custom + shadcn/ui patterns
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form
- **State**: Zustand

### Backend
- **Runtime**: Node.js
- **Server**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Clerk
- **AI/LLM**: OpenAI API (GPT-3.5)
- **PDF Processing**: pdf-parse

### DevOps & Tools
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Linting**: ESLint (Next.js default)
- **Code Formatting**: Prettier
- **Database Migrations**: Prisma

## 📋 Project Structure

```
pdf-quiz-generator/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── api/
│   │   │   ├── documents/
│   │   │   ├── quizzes/
│   │   │   ├── quiz-attempts/
│   │   │   └── settings/
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (main dashboard)
│   │   │   ├── upload/
│   │   │   ├── quiz-generator/
│   │   │   ├── history/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── quiz/
│   │   │   ├── [quizId]/
│   │   │   └── results/[attemptId]/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx (landing)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Skeleton.tsx
│   │   └── landing/
│   │       └── LandingComponents.tsx
│   ├── utils/
│   │   ├── pdf.ts (PDF extraction)
│   │   ├── quiz-generator.ts (AI quiz generation)
│   │   ├── validation.ts (form validation)
│   │   └── constants.ts (app constants)
│   └── lib/
│       └── prisma.ts (database client)
├── prisma/
│   ├── schema.prisma (database schema)
│   └── seed.ts (seed data)
├── public/
│   └── favicon.ico
├── .env.local (local environment)
├── .env.example (template)
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- OpenAI API key
- Clerk account for authentication

### 1. Clone & Install

```bash
cd pdf-quiz-generator
npm install
```

### 2. Environment Setup

Create `.env.local` with required variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quiz_generator_dev"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# OpenAI API
OPENAI_API_KEY="sk-..."

# App Config
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# PDF Processing
PDF_MAX_SIZE_MB=50
PDF_EXTRACTION_TIMEOUT=30000
```

### 3. Database Setup

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed demo data (optional)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Authentication
All API endpoints require Clerk authentication. The `auth()` function from `@clerk/nextjs` is used server-side.

### Endpoints

#### Documents
- `POST /api/documents/upload` - Upload and process PDF
- `GET /api/documents/[documentId]` - Get document details

#### Quizzes
- `POST /api/quizzes/generate` - Generate quiz from document
- `GET /api/quizzes/[quizId]` - Get quiz questions
- `POST /api/quizzes/[quizId]/submit` - Submit quiz answers

#### Attempts
- `GET /api/quiz-attempts/[attemptId]` - Get attempt results

#### Settings
- `PUT /api/settings` - Update user settings

## 🎮 Usage Guide

### For New Users

1. **Sign Up** - Create account via Clerk authentication
2. **Upload PDF** - Go to Dashboard → Upload PDF with drag-and-drop
3. **Generate Quiz** - Select question type, difficulty, and count
4. **Take Quiz** - Answer questions with smooth interface
5. **Review Results** - See score, explanations, and analytics

### For Returning Users

- **Dashboard** - Quick access to recent quizzes and documents
- **History** - Review past quiz attempts
- **Analytics** - Track learning progress over time
- **Settings** - Customize preferences

## 🔧 Configuration

### Quiz Generation Parameters

```typescript
// In quiz-generator.ts
{
  questionCount: 5 | 10 | 15 | 20,
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed',
  questionType: 'mcq' | 'true_false' | 'short_answer' | 'mixed',
}
```

### PDF Processing

```typescript
// Maximum file size: 50MB (configurable in .env.local)
// Extraction timeout: 30s default
// Supports: Single and multiple PDFs
```

## 📊 Database Schema

### Core Models

**User**
- Authentication via Clerk
- Profile data (email, name, avatar)
- Settings and preferences

**Document**
- Uploaded PDF metadata
- Extracted content and keywords
- Main topics and references

**Quiz**
- Quiz configuration and questions
- Generated from documents
- Tracks difficulty and type

**Question**
- Quiz questions with options
- Correct answers and explanations
- Source references from PDF

**QuizAttempt**
- User quiz submissions
- Scores and performance metrics
- Individual answers

**QuizAnswer**
- Per-question user responses
- Correctness evaluation
- Timestamps

## 🎨 Design System

### Colors
- **Primary**: #7c3aed (Purple)
- **Accent**: #06b6d4 (Cyan)
- **Success**: #10b981 (Green)
- **Error**: #ef4444 (Red)
- **Warning**: #f59e0b (Amber)

### Typography
- **Display Font**: Space Grotesk (headings)
- **Body Font**: Inter (content)

### Effects
- **Glass**: Backdrop blur + transparency
- **Shadow**: Custom glow effects
- **Animation**: Smooth 300-500ms transitions

## 🚀 Deployment

### Recommended Platforms

#### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Option 2: Docker + Cloud Run
```bash
docker build -t pdf-quiz-generator .
```

#### Option 3: Railway/Render
- Connect GitHub repository
- Add environment variables
- Deploy automatically

### Production Checklist

- [ ] Database: PostgreSQL production instance
- [ ] Auth: Clerk production keys
- [ ] API Keys: OpenAI paid tier
- [ ] Storage: S3/Cloud Storage for PDFs
- [ ] Domain: Custom domain setup
- [ ] SSL: HTTPS enabled
- [ ] CDN: Static assets cached
- [ ] Monitoring: Error tracking setup
- [ ] Backups: Database backups enabled
- [ ] Analytics: User analytics configured

## 🔐 Security

- **Authentication**: Clerk managed SSO
- **Authorization**: Row-level security with user verification
- **API**: Protected endpoints with auth middleware
- **Database**: Environment variables for connection
- **Secrets**: .env.local for sensitive keys (.gitignored)
- **Validation**: Input validation on all endpoints
- **Rate Limiting**: Recommended for production

## ⚡ Performance Optimization

- ✅ Server-side rendering for landing page
- ✅ Code splitting with dynamic imports
- ✅ Image optimization with Next.js Image
- ✅ CSS-in-JS with Tailwind purging
- ✅ Database query optimization with Prisma
- ✅ API response compression
- ✅ Caching strategies for PDFs
- ✅ Lazy loading for charts and analytics

## 🧪 Testing

### Unit Tests (Recommended Setup)
```bash
npm install --save-dev jest @testing-library/react
npm test
```

### Integration Tests
- API endpoint validation
- Database transaction testing
- Authentication flow testing

### E2E Tests
- User flow testing with Playwright
- Quiz generation end-to-end
- Results page validation

## 📈 Future Enhancements

### Phase 2 Features
- [ ] Direct LLM model selection (GPT-4, Claude, Llama)
- [ ] Multi-language quiz generation
- [ ] Shared quiz links and collaborative mode
- [ ] Study groups and peer learning
- [ ] AI tutor for weak topics
- [ ] Quiz export to PDF
- [ ] Mobile app (React Native)
- [ ] Real-time progress sync

### Advanced Features
- [ ] Spaced repetition scheduling
- [ ] Adaptive difficulty adjustment
- [ ] Video-based explanations
- [ ] Voice input/output support
- [ ] Integration with LMS systems
- [ ] API for third-party developers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License & Usage

This is an open-source project. You are free to use, modify, and distribute this project as per your needs. Please ensure you comply with the licenses of the dependencies used.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for database ORM
- Clerk for authentication
- OpenAI for LLM capabilities
- Tailwind CSS for styling
- All open-source contributors

## 📞 Support

For support, open an issue on GitHub or check the documentation files included in the project.

## 🌐 Project Resources

- **GitHub**: [github.com/your-username/pdf-quiz-generator](https://github.com)
- **Issues**: Report bugs or request features

---

Build, share, and succeed with intelligent learning tools. Happy learning! 🚀
