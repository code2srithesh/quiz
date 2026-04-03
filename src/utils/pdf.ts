// Utility functions for PDF processing and text extraction
import pdfParse from 'pdf-parse';

interface ExtractedPDFContent {
    text: string;
    pageCount: number;
    metadata?: {
        title?: string;
        author?: string;
        subject?: string;
    };
}

/**
 * Extract text from a PDF file buffer
 */
export async function extractPDFText(buffer: Buffer): Promise<ExtractedPDFContent> {
    try {
        const data = await pdfParse(buffer);

        return {
            text: data.text,
            pageCount: data.numpages,
            metadata: data.metadata?.metadata || undefined,
        };
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

/**
 * Clean and normalize extracted text
 */
export function cleanText(text: string): string {
    return text
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
        .trim();
}

/**
 * Split text into chunks for processing
 */
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.substring(start, end));
        start += chunkSize - overlap;
    }

    return chunks;
}

/**
 * Extract main topics and keywords from text
 */
export function extractKeywords(text: string, limit: number = 10): string[] {
    // Simple keyword extraction based on frequency
    const words = text
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 5);

    const frequency: { [key: string]: number } = {};

    words.forEach((word) => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([word]) => word);
}
