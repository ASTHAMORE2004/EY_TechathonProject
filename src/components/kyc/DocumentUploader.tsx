import React, { useState, useCallback } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Upload,
  X,
  Eye,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  extractedData: Record<string, string>;
  errors: string[];
  warnings: string[];
}

interface DocumentUploaderProps {
  label: string;
  icon: React.ElementType;
  documentType: 'pan' | 'aadhaar' | 'income';
  accept?: string;
  onFileChange: (file: File | null) => void;
  onValidationComplete: (result: ValidationResult | null) => void;
}

export function DocumentUploader({
  label,
  icon: Icon,
  documentType,
  accept = "image/*,.pdf",
  onFileChange,
  onValidationComplete,
}: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationStep, setValidationStep] = useState('');

  const validateDocument = useCallback(async (uploadedFile: File) => {
    setIsValidating(true);
    setValidationProgress(0);
    setValidationResult(null);

    try {
      // Step 1: Reading file
      setValidationStep('Reading document...');
      setValidationProgress(10);
      await new Promise(r => setTimeout(r, 300));

      // Convert to base64
      const buffer = await uploadedFile.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      
      // Step 2: Uploading for analysis
      setValidationStep('Uploading for OCR analysis...');
      setValidationProgress(25);
      await new Promise(r => setTimeout(r, 200));

      // Step 3: Running OCR
      setValidationStep('Extracting text with OCR...');
      setValidationProgress(40);

      // Call the validation edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-document`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentType,
            fileName: uploadedFile.name,
            fileType: uploadedFile.type,
            base64Data: base64,
          }),
        }
      );

      setValidationStep('Analyzing document content...');
      setValidationProgress(70);

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const result: ValidationResult = await response.json();
      
      setValidationStep('Validation complete!');
      setValidationProgress(100);
      
      await new Promise(r => setTimeout(r, 300));
      
      setValidationResult(result);
      onValidationComplete(result);

    } catch (error) {
      console.error('Validation error:', error);
      const errorResult: ValidationResult = {
        isValid: false,
        confidence: 0,
        extractedData: {},
        errors: ['Failed to validate document. Please try again.'],
        warnings: [],
      };
      setValidationResult(errorResult);
      onValidationComplete(errorResult);
    } finally {
      setIsValidating(false);
      setValidationStep('');
    }
  }, [documentType, onValidationComplete]);

  const handleFileSelect = useCallback(async (selectedFile: File | null) => {
    setFile(selectedFile);
    onFileChange(selectedFile);
    setValidationResult(null);

    if (selectedFile) {
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }

      // Start validation
      await validateDocument(selectedFile);
    } else {
      setPreview(null);
      onValidationComplete(null);
    }
  }, [onFileChange, onValidationComplete, validateDocument]);

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setValidationResult(null);
    onFileChange(null);
    onValidationComplete(null);
  };

  const getStatusColor = () => {
    if (isValidating) return 'border-primary';
    if (!validationResult) return 'border-border hover:border-primary';
    if (validationResult.isValid) return 'border-success';
    return 'border-destructive';
  };

  const getStatusBg = () => {
    if (isValidating) return 'bg-primary/5';
    if (!validationResult) return 'hover:bg-primary/5';
    if (validationResult.isValid) return 'bg-success/5';
    return 'bg-destructive/5';
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Icon size={16} className="text-muted-foreground" />
        {label}
      </label>

      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all duration-200',
          getStatusColor(),
          getStatusBg()
        )}
      >
        {!file ? (
          <label className="flex flex-col items-center justify-center h-32 cursor-pointer p-4">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Click or drag to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or PDF
            </p>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <div className="p-4">
            {/* File Info & Preview */}
            <div className="flex items-start gap-3">
              {preview ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => window.open(preview, '_blank')}
                    className="absolute inset-0 bg-background/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Eye size={16} className="text-foreground" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <FileText size={24} className="text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>

                {/* Validation Progress */}
                {isValidating && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-primary" />
                      <span className="text-xs text-primary">{validationStep}</span>
                    </div>
                    <Progress value={validationProgress} className="h-1.5" />
                  </div>
                )}
              </div>

              <button
                onClick={handleRemove}
                className="p-1 rounded-full hover:bg-secondary transition-colors flex-shrink-0"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Validation Result */}
            {validationResult && !isValidating && (
              <div className="mt-3 space-y-2">
                {/* Status Badge */}
                <div className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg',
                  validationResult.isValid ? 'bg-success/10' : 'bg-destructive/10'
                )}>
                  {validationResult.isValid ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : (
                    <AlertCircle size={16} className="text-destructive" />
                  )}
                  <span className={cn(
                    'text-sm font-medium',
                    validationResult.isValid ? 'text-success' : 'text-destructive'
                  )}>
                    {validationResult.isValid ? 'Document Verified' : 'Verification Failed'}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {validationResult.confidence}% confidence
                  </span>
                </div>

                {/* Extracted Data */}
                {Object.keys(validationResult.extractedData).length > 0 && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(validationResult.extractedData).map(([key, value]) => (
                      <div key={key} className="bg-secondary/50 px-2 py-1.5 rounded">
                        <span className="text-muted-foreground">{key}: </span>
                        <span className="text-foreground font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Errors */}
                {validationResult.errors.length > 0 && (
                  <div className="space-y-1">
                    {validationResult.errors.map((error, i) => (
                      <p key={i} className="text-xs text-destructive flex items-start gap-1">
                        <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {validationResult.warnings.length > 0 && (
                  <div className="space-y-1">
                    {validationResult.warnings.map((warning, i) => (
                      <p key={i} className="text-xs text-warning flex items-start gap-1">
                        <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                        {warning}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
