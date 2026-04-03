'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { validatePDFFile, formatFileSize } from '@/utils/validation';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [description, setDescription] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            handleFileSelect(droppedFiles[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        const validation = validatePDFFile(selectedFile);

        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('description', description);

            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setSuccess(true);

            // Redirect to quiz generator after 2 seconds
            setTimeout(() => {
                router.push(`/dashboard/quiz-generator?documentId=${data.documentId}`);
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Upload PDF</h1>
                <p className="text-gray-400">
                    Select a PDF file to extract content and generate a quiz
                </p>
            </div>

            <Card variant="glass" className="p-12">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-glass-lighter hover:border-primary/50'}`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileSelect(e.target.files?.[0]!)}
                        className="hidden"
                    />

                    <div className="text-6xl mb-4">📄</div>

                    {file ? (
                        <div>
                            <p className="font-semibold text-white mb-2">{file.name}</p>
                            <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-xl font-semibold mb-2">
                                Drop your PDF here or click to browse
                            </p>
                            <p className="text-gray-400">Maximum file size: 50MB</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-error/10 border border-error/50 rounded-lg text-error">
                        {error}
                    </div>
                )}

                {file && (
                    <div className="mt-6">
                        <Input
                            label="Description (optional)"
                            placeholder="What is this document about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="mt-6 flex gap-3">
                            <Button
                                onClick={handleUpload}
                                isLoading={uploading}
                                fullWidth
                            >
                                Upload & Generate Quiz
                            </Button>
                            <Button
                                onClick={() => {
                                    setFile(null);
                                    setDescription('');
                                }}
                                variant="outline"
                                disabled={uploading}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Success modal */}
            <Modal isOpen={success} onClose={() => setSuccess(false)} title="Success!">
                <div className="text-center py-4">
                    <p className="text-lg mb-4">✨ PDF uploaded successfully!</p>
                    <p className="text-gray-400">Redirecting to quiz generator...</p>
                </div>
            </Modal>
        </div>
    );
}
