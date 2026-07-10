import { useCallback, useState } from 'react'

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
}

interface UseImageUploadResult {
  isUploading: boolean;
  uploadFile: (file: File, folder?: string) => Promise<string>;
  uploadDataUrl: (dataUrl: string, folder?: string) => Promise<string>;
}

export function useImageUpload(): UseImageUploadResult {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(async (file: File, folder?: string): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) formData.append('folder', folder);

      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Upload failed');
      }
      return data.url as string;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadDataUrl = useCallback(async (dataUrl: string, folder?: string): Promise<string> => {
    const file = await dataUrlToFile(dataUrl, `capture-${Date.now()}.jpg`);
    return uploadFile(file, folder);
  }, [uploadFile]);

  return { isUploading, uploadFile, uploadDataUrl };
}
