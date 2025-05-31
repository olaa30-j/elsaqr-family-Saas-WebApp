import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import type { Album } from '../../../../types/album';

interface ImageUploaderProps {    
  onUpload:(file: File, description?: string) => Promise<Album>;
}

export const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      await onUpload(file);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition">
        {isUploading ? (
          <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
        ) : (
          <Upload className="text-gray-400 mb-2" size={24} />
        )}
        <span className="text-sm text-gray-600">
          {isUploading ? 'Uploading...' : 'Drag & drop or click to upload'}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
      
      {preview && (
        <div className="mt-2 flex justify-center">
          <img src={preview} alt="Preview" className="h-20 rounded" />
        </div>
      )}
    </div>
  );
};