# PDF Quiz Generator - API & Integration Examples

Real-world examples for integrating with the PDF Quiz Generator.

## 📚 Table of Contents
1. Authentication Examples
2. Document Upload Examples
3. Quiz Generation Examples
4. Quiz Taking Examples
5. Results Retrieval Examples
6. Advanced Usage

---

## 🔐 Authentication Examples

### Frontend: Sign Up Flow
```typescript
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
```

### Frontend: Using Authentication
```typescript
import { useUser, useClerk } from '@clerk/nextjs';

export function Dashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Backend: Protected API Route
```typescript
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // User is authenticated
  return NextResponse.json({ userId });
}
```

---

## 📄 Document Upload Examples

### Upload PDF with Fetch
```typescript
async function uploadPDF(file: File, description: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', description);

  try {
    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    console.log('Document uploaded:', data.documentId);
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Usage
const file = new File(['...'], 'document.pdf', { type: 'application/pdf' });
uploadPDF(file, 'My ML Document');
```

### Drag and Drop Upload
```typescript
import { useState } from 'react';

export function PDFDropZone() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type === 'application/pdf') {
        await uploadPDF(file, '');
      }
    }
  };

  return (
    <div
      onDragOver={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`p-8 border-2 border-dashed rounded-lg ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}
    >
      Drop PDF here or click to browse
    </div>
  );
}
```

### Validate PDF Before Upload
```typescript
import { validatePDFFile, formatFileSize } from '@/utils/validation';

function handleFileSelect(file: File) {
  const validation = validatePDFFile(file);

  if (!validation.valid) {
    console.error(validation.error);
    return;
  }

  console.log(`✓ Valid PDF: ${formatFileSize(file.size)}`);
  uploadPDF(file, '');
}
```

---

## 🎮 Quiz Generation Examples

### Generate with Custom Parameters
```typescript
async function generateQuiz(
  documentId: string,
  options: {
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    questionType: 'mcq' | 'true_false' | 'short_answer' | 'mixed';
  },
) {
  try {
    const response = await fetch('/api/quizzes/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId,
        ...options,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    return data.quizId;
  } catch (error) {
    console.error('Generation error:', error);
    throw error;
  }
}

// Usage
const quizId = await generateQuiz('doc_123', {
  questionCount: 10,
  difficulty: 'medium',
  questionType: 'mixed',
});

window.location.href = `/quiz/${quizId}`;
```

### Progress Tracking During Generation
```typescript
async function generateQuizWithProgress(
  documentId: string,
  options: any,
  onProgress: (stage: string) => void,
) {
  onProgress('Analyzing content...');

  // Simulate stages
  const stages = [
    'Extracting concepts',
    'Generating questions',
    'Validating answers',
    'Creating quiz',
  ];

  for (const stage of stages) {
    onProgress(stage);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const quizId = await generateQuiz(documentId, options);
  return quizId;
}

// Usage
generateQuizWithProgress('doc_123', options, (stage) => {
  console.log(`📝 ${stage}`);
  updateUI(stage);
});
```

---

## ✏️ Quiz Taking Examples

### Fetch Quiz Questions
```typescript
async function fetchQuiz(quizId: string) {
  try {
    const response = await fetch(`/api/quizzes/${quizId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }

    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Usage
const questions = await fetchQuiz('quiz_456');
console.log(`Loaded ${questions.length} questions`);
```

### Handle Different Question Types
```typescript
function renderQuestion(question: Question) {
  switch (question.questionType) {
    case 'mcq':
      return (
        <div>
          <h3>{question.questionText}</h3>
          {question.options?.map((option, i) => (
            <label key={i}>
              <input type="radio" name="answer" value={option.text} />
              {option.text}
            </label>
          ))}
        </div>
      );

    case 'true_false':
      return (
        <div>
          <h3>{question.questionText}</h3>
          <label>
            <input type="radio" name="answer" value="True" />
            True
          </label>
          <label>
            <input type="radio" name="answer" value="False" />
            False
          </label>
        </div>
      );

    case 'short_answer':
      return (
        <div>
          <h3>{question.questionText}</h3>
          <textarea placeholder="Your answer..." />
        </div>
      );

    default:
      return null;
  }
}
```

### Submit Quiz Answers
```typescript
async function submitQuiz(quizId: string, answers: { [questionId: string]: string }) {
  try {
    const response = await fetch(`/api/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    console.log(`Score: ${data.score}%`);
    return data.attemptId;
  } catch (error) {
    console.error('Submission error:', error);
    throw error;
  }
}

// Usage
const attemptId = await submitQuiz('quiz_456', {
  'q_1': 'Option A',
  'q_2': 'True',
  'q_3': 'My answer',
});

// Redirect to results
window.location.href = `/quiz/results/${attemptId}`;
```

---

## 📊 Results & Analytics Examples

### Fetch Quiz Results
```typescript
async function getQuizResults(attemptId: string) {
  try {
    const response = await fetch(`/api/quiz-attempts/${attemptId}`);

    if (!response.ok) {
      throw new Error('Results not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Usage
const { attempt, details } = await getQuizResults('attempt_789');
console.log(`Score: ${attempt.score}%`);
details.forEach((q) => {
  console.log(`Q: ${q.questionText}`);
  console.log(`Your answer: ${q.userAnswer}`);
  console.log(`Correct: ${q.correctAnswer}`);
  console.log(`✓ Correct: ${q.isCorrect}`);
});
```

### Display Performance Analytics
```typescript
import { LineChart, Line, BarChart, Bar, ResponsiveContainer } from 'recharts';

function PerformanceChart({ attempts }: { attempts: QuizAttempt[] }) {
  // Transform data for chart
  const chartData = attempts.map((a) => ({
    date: new Date(a.completedAt).toLocaleDateString(),
    score: a.score,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="score" stroke="#7c3aed" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Generate Study Recommendations
```typescript
async function getStudyRecommendations(
  quizTitle: string,
  weakAreas: string[],
  strongAreas: string[],
) {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizTitle,
        weakAreas,
        strongAreas,
      }),
    });

    const data = await response.json();
    return data.recommendation;
  } catch (error) {
    console.error('Error:', error);
    return 'Continue practicing!';
  }
}

// Usage
const rec = await getStudyRecommendations(
  'ML Quiz',
  ['Neural Networks'],
  ['Classification', 'Regression'],
);
console.log(rec);
```

---

## 🔧 Advanced Usage

### Batch Upload Multiple PDFs
```typescript
async function uploadMultiplePDFs(files: File[]) {
  const results = [];

  for (const file of files) {
    try {
      const result = await uploadPDF(file, file.name);
      results.push({ file: file.name, success: true, documentId: result.documentId });
    } catch (error) {
      results.push({ file: file.name, success: false, error });
    }
  }

  return results;
}

// Usage
const files = [file1, file2, file3];
const results = await uploadMultiplePDFs(files);
results.forEach((r) => {
  if (r.success) {
    console.log(`✓ ${r.file} uploaded`);
  } else {
    console.log(`✗ ${r.file} failed: ${r.error}`);
  }
});
```

### Create Quiz Generation Pipeline
```typescript
async function createQuizPipeline(
  file: File,
  quizOptions: QuizOptions,
  onStage: (stage: string) => void,
) {
  try {
    onStage('📤 Uploading PDF...');
    const uploadResult = await uploadPDF(file, 'Auto-generated');

    onStage('🔨 Generating quiz...');
    const quizId = await generateQuizWithProgress(
      uploadResult.documentId,
      quizOptions,
      onStage,
    );

    onStage('✓ Quiz ready!');
    return { documentId: uploadResult.documentId, quizId };
  } catch (error) {
    onStage('✗ Error occurred');
    throw error;
  }
}

// Usage
const { quizId } = await createQuizPipeline(
  pdfFile,
  { questionCount: 10, difficulty: 'medium', questionType: 'mixed' },
  (stage) => updateProgressUI(stage),
);

// Redirect to quiz
router.push(`/quiz/${quizId}`);
```

### Export Quiz Results
```typescript
async function exportQuizResultsToPDF(attemptId: string): Promise<Blob> {
  const { attempt, details } = await getQuizResults(attemptId);

  // Create PDF
  const doc = new Document();

  doc.addPage();
  doc.fontSize(20).text(`Quiz Results: ${attempt.score}%`);
  doc.fontSize(12).text(`Total: ${attempt.totalQuestions} questions`);
  doc.text(`Correct: ${attempt.correctAnswers}`);

  details.forEach((detail) => {
    doc.addPage();
    doc.fontSize(14).text(detail.questionText);
    doc.fontSize(10).text(`Your answer: ${detail.userAnswer}`);
    doc.text(`Correct: ${detail.correctAnswer}`);
    doc.text(`Status: ${detail.isCorrect ? '✓ Correct' : '✗ Incorrect'}`);
  });

  return doc.getBlob();
}

// Usage
const pdfBlob = await exportQuizResultsToPDF('attempt_789');
const url = URL.createObjectURL(pdfBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'quiz-results.pdf';
a.click();
```

### Real-time Quiz Sync
```typescript
import { useEffect, useState } from 'react';

function useQuizAutoSave(quizId: string, answers: Answers) {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch(`/api/quizzes/${quizId}/auto-save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        });
        console.log('Progress saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [quizId, answers]);
}
```

---

## 🧪 Testing Your Integration

### Test Endpoints
```bash
# Test upload
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@document.pdf" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test quiz generation
curl -X POST http://localhost:3000/api/quizzes/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "documentId": "doc_123",
    "questionCount": 10,
    "difficulty": "medium",
    "questionType": "mixed"
  }'

# Test quiz fetch
curl http://localhost:3000/api/quizzes/quiz_456 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test quiz submission
curl -X POST http://localhost:3000/api/quizzes/quiz_456/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "answers": {
      "q_1": "Option A",
      "q_2": "True"
    }
  }'
```

---

## 📞 Help & Support

For more information:
- API Documentation: See ARCHITECTURE.md
- Setup Guide: See SETUP.md
- Main README: See README.md
- Issues: GitHub Issues page

---

**Last Updated**: January 2024
