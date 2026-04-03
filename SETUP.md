# PDF Quiz Generator - Complete Setup Guide

This guide will walk you through setting up the PDF Quiz Generator application from scratch.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **PostgreSQL**: Version 14 or higher (or Docker)
- **Git**: For version control
- **Code Editor**: VS Code recommended

## 🔑 Required API Keys

You'll need to obtain these before starting:

### 1. Clerk Authentication
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up for a free account
3. Create a new application
4. Copy your API keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 2. OpenAI API
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create an account and verify your email
3. Go to API keys section
4. Create a new API key
5. Copy the key as `OPENAI_API_KEY`
   - **Note**: You need a paid OpenAI account with credits

## 🗄️ Database Setup

### Option A: Local PostgreSQL (Recommended for Development)

#### On macOS (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
createdb quiz_generator_dev
```

#### On Windows:
1. Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow setup
3. Remember the password you set for `postgres` user
4. Create database:
```bash
psql -U postgres
CREATE DATABASE quiz_generator_dev;
\q
```

#### On Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb quiz_generator_dev
```

### Option B: Docker (Easiest)

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Wait for container to be healthy
docker-compose ps
```

Access Adminer GUI at `http://localhost:8080`
- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: postgres
- Database: quiz_generator_dev

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
cd ~/Desktop
git clone <repo-url> quiz
cd quiz
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in package.json.

### 3. Environment Setup

#### Create .env.local file:

```bash
cp .env.example .env.local
```

#### Edit .env.local with your credentials:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quiz_generator_dev"

# Clerk Authentication (from Step 1)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_key_here"
CLERK_SECRET_KEY="sk_test_your_key_here"

# OpenAI API (from Step 2)
OPENAI_API_KEY="sk-your_openai_key_here"

# App Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# PDF Processing
PDF_MAX_SIZE_MB=50
PDF_EXTRACTION_TIMEOUT=30000
```

### 4. Database Setup

#### Push Prisma Schema:
```bash
npm run db:push
```

This creates all required database tables.

#### Generate Prisma Client:
```bash
npm run db:generate
```

#### (Optional) Seed Demo Data:
```bash
npm run db:seed
```

This adds sample data for testing.

### 5. Start Development Server

```bash
npm run dev
```

You should see:
```
> pdf-quiz-generator@1.0.0 dev
> next dev

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1.2s
```

### 6. Verify Installation

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- ✅ Landing page with hero section
- ✅ Navigation with Sign In / Sign Up buttons
- ✅ Features section
- ✅ CTA section

## 🔐 First-Time User Setup

### 1. Create Clerk Account

1. Go to [http://localhost:3000](http://localhost:3000)
2. Click "Get Started Free" or "Sign Up"
3. Follow Clerk's authentication flow
4. You'll be redirected to the dashboard

### 2. Upload Your First PDF

1. From dashboard, click "Upload PDF"
2. Drag and drop a PDF file or click to browse
3. Add a description (optional)
4. Click "Upload & Generate Quiz"

### 3. Generate Your First Quiz

1. Select quiz parameters:
   - Number of questions: 10
   - Difficulty: Mixed
   - Question type: Mixed
2. Click "Generate Quiz"
3. Wait for AI to process (30-60 seconds)

### 4. Take the Quiz

1. Answer all questions
2. Click "Next" or fill in answers
3. Review your answers
4. Click "Submit Quiz"

### 5. View Results

1. See your score with breakdown
2. Review each question and explanation
3. Check analytics and improvements

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript type check
npm run type-check

# Format code
npm run format

# Database operations
npm run db:push       # Push schema changes
npm run db:generate   # Regenerate Prisma client
npm run db:seed       # Seed demo data

# Linting
npm run lint
```

## 🔧 Troubleshooting

### Issue: "Cannot find module 'prisma'"
**Solution:**
```bash
npm install
npm run db:generate
```

### Issue: "Database connection error"
**Solution:**
1. Verify PostgreSQL is running:
```bash
psql -U postgres
\q
```
2. Check DATABASE_URL in .env.local
3. Ensure database exists:
```bash
creatdb quiz_generator_dev
```

### Issue: "Clerk authentication not working"
**Solution:**
1. Verify NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set
2. Verify CLERK_SECRET_KEY is set
3. Restart dev server: `npm run dev`

### Issue: "OpenAI API errors"
**Solution:**
1. Verify OPENAI_API_KEY is correct
2. Check your OpenAI account has credits
3. Verify API key is enabled in OpenAI dashboard

### Issue: "PDF upload fails"
**Solution:**
1. Ensure PDF file is valid
2. Check file size is under 50MB
3. Verify NODE_ENV is "development" for local testing

## 📱 Testing the Application

### Admin Panel Features to Test

1. **Dashboard**
   - View uploaded documents
   - See recent quizzes
   - Quick action cards

2. **Upload**
   - Drag and drop PDF
   - File validation
   - Upload progress

3. **Quiz Generator**
   - Customize quiz settings
   - Generate quiz
   - Error handling

4. **Quiz Taking**
   - Answer questions
   - Navigate between questions
   - Submit quiz

5. **Results**
   - View score
   - See explanations
   - Check analytics

6. **History**
   - View past quizzes
   - Search and filter
   - View detailed results

7. **Analytics**
   - Score trends
   - Performance charts
   - Topic breakdown

8. **Settings**
   - Change theme
   - Set defaults
   - Save preferences

## 📦 Production Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables
5. Deploy

### Deploy to Docker

```bash
# Build image
docker build -t pdf-quiz-generator .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e OPENAI_API_KEY="..." \
  pdf-quiz-generator
```

### Deploy to Railway/Render

1. Connect GitHub repository
2. Configure environment variables
3. Database provisioning
4. Deploy

## 📚 Additional Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Clerk Docs**: [clerk.com/docs](https://clerk.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **OpenAI API**: [platform.openai.com/docs](https://platform.openai.com/docs)

## 🆘 Getting Help

- **Issues**: Create GitHub issue with details
- **Discussions**: Use GitHub discussions
- **Email**: support@example.com
- **Community**: Join our Discord

## ✅ Verification Checklist

After setup, verify:

- [ ] Node.js and npm installed
- [ ] PostgreSQL running
- [ ] .env.local file created with all keys
- [ ] `npm run db:push` successful
- [ ] Dev server starts: `npm run dev`
- [ ] Landing page loads without errors
- [ ] Can sign up with Clerk
- [ ] Can upload PDF
- [ ] Can generate quiz
- [ ] Can take quiz and view results
- [ ] Analytics page displays correctly
- [ ] Dark theme applies properly

## 🎉 You're All Set!

Congratulations! Your PDF Quiz Generator is now running on your system.

Start building and customizing! 🚀
