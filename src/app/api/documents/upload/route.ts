import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { extractPDFText, cleanText, extractKeywords } from '@/utils/pdf';
import { extractMainTopics } from '@/utils/quiz-generator';

export async function POST(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const description = (formData.get('description') as string) || '';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Read file and extract PDF text
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        const { text, pageCount } = await extractPDFText(uint8Array as any);

        if (!text || text.length === 0) {
            return NextResponse.json(
                { error: 'Could not extract text from PDF' },
                { status: 400 },
            );
        }

        const cleanedText = cleanText(text);
        const keywords = extractKeywords(cleanedText);
        const mainTopics = await extractMainTopics(cleanedText, file.name);

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create document record
        const document = await prisma.document.create({
            data: {
                userId: user.id,
                title: file.name.replace('.pdf', ''),
                description,
                fileSize: file.size,
                pageCount,
                storagePath: `/uploads/${Date.now()}-${file.name}`,
                extractedText: cleanedText.substring(0, 5000), // Store first 5000 chars
                keywords,
                mainTopics,
            },
        });

        return NextResponse.json({
            success: true,
            documentId: document.id,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to process PDF' },
            { status: 500 },
        );
    }
}
