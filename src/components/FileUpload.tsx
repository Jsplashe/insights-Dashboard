import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: FileList) => void;
  isAnalyzing: boolean;
}

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx,.txt';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validateFiles = (files: FileList): boolean => {
    setError(null);

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds the maximum size limit of 10MB`);
        return false;
      }

      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!ACCEPTED_FILE_TYPES.includes(fileExtension)) {
        setError(`File "${file.name}" is not a supported format`);
        return false;
      }
    }

    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0 && validateFiles(e.dataTransfer.files)) {
      onFileSelect(e.dataTransfer.files);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && validateFiles(e.target.files)) {
      onFileSelect(e.target.files);
    }
  }, [onFileSelect]);

  return (
    <div className="space-y-4">
      <div
        className={`p-8 bg-dark-300 rounded-xl border-2 border-dashed transition-all duration-200 ${
          isDragging ? 'border-accent-400 bg-dark-200' : 'border-dark-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-white">Upload Resources</h3>
          <p className="mt-2 text-sm text-gray-400">
            Drag and drop your files here, or click to select files
          </p>
          <div className="mt-2 flex flex-col items-center text-xs text-gray-500 space-y-1">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Supported formats: PDF, DOC, DOCX, TXT
            </div>
            <div>Maximum file size: 10MB</div>
          </div>
          <label className="mt-4 inline-block">
            <input
              type="file"
              className="hidden"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleFileInput}
              multiple
            />
            <span className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors cursor-pointer inline-block">
              Select Files
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 rounded-lg px-4 py-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex items-center justify-center space-x-2 text-accent-400 bg-accent-400/10 rounded-lg px-4 py-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          <span className="text-sm">Analyzing document...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;