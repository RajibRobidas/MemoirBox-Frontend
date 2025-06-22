import React, { useState, useRef } from 'react';

const MODELSLAB_URL = 'https://modelslab.com/api/v6/image_editing/object_removal';
const MODELSLAB_KEY = process.env.REACT_APP_MODELSLAB_KEY;

const AIObjectRemoval: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For now, use a placeholder mask (white mask over the whole image)
  const [maskBase64, setMaskBase64] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
      // Generate a placeholder mask (all white, same size as image)
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, img.width, img.height);
          setMaskBase64(canvas.toDataURL('image/png').split(',')[1]);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
      // Generate a placeholder mask (all white, same size as image)
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, img.width, img.height);
          setMaskBase64(canvas.toDataURL('image/png').split(',')[1]);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
    setMaskBase64(null);
  };

  // Helper: Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !maskBase64) return;
    setLoading(true);
    setError(null);
    setResultUrl(null);
    try {
      // Convert image to base64
      const base64Image = await fileToBase64(selectedFile);
      // Prepare request body
      const body = {
        key: MODELSLAB_KEY,
        init_image: base64Image,
        mask_image: maskBase64,
        base64: true,
        webhook: null,
        track_id: null,
      };
      // Call Modelslab API
      const response = await fetch(MODELSLAB_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status === 'success' && data.image) {
        setResultUrl(`data:image/png;base64,${data.image}`);
      } else {
        throw new Error(data.message || 'Object removal failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Download helper
  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const response = await fetch(resultUrl, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'object-removed.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download image. Please try right-clicking and saving manually.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-100 via-white to-gray-100 flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-strong p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-8 -left-8 text-[7rem] opacity-10 pointer-events-none select-none">❌</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-red-500 drop-shadow-lg flex items-center gap-2">
            <span className="inline-block">Object Remover</span>
          </h1>
          <p className="text-text-secondary mb-8 text-center max-w-md">Upload a photo and (soon) select the object to remove. For now, the whole image is masked as a demo. Download your new image in seconds!</p>

          {/* Upload Area */}
          {!previewUrl && (
            <div
              className="w-full bg-gradient-to-br from-red-100 to-gray-100 border-2 border-dashed border-red-300 rounded-2xl flex flex-col items-center justify-center py-12 cursor-pointer hover:shadow-lg transition-all duration-200 mb-6"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="text-5xl mb-2">🖼️</div>
              <div className="text-lg font-medium text-red-500 mb-1">Click or Drag & Drop to Upload</div>
              <div className="text-text-secondary text-sm">PNG, JPG, JPEG, up to 5MB</div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                disabled={loading}
              />
            </div>
          )}

          {/* Preview Area */}
          {previewUrl && (
            <div className="mb-6 w-full flex flex-col items-center">
              <div className="relative w-full flex flex-col items-center">
                <img src={previewUrl} alt="Preview" className="max-w-xs max-h-64 rounded-2xl shadow-lg border-2 border-red-200 bg-white" />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-white/80 text-red-500 rounded-full p-2 shadow hover:bg-red-50 transition-colors"
                  title="Remove"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* TODO: Add mask drawing UI here */}
              <div className="mt-2 text-xs text-red-400">(Mask: currently whole image, custom selection coming soon)</div>
            </div>
          )}

          {/* Form Button */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            {previewUrl && (
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md hover:from-red-600 hover:to-red-400 transition-all duration-200 disabled:opacity-60"
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </span>
                ) : (
                  'Remove Object'
                )}
              </button>
            )}
          </form>

          {/* Error Message */}
          {error && <div className="mt-4 text-red-600 text-center font-medium">{error}</div>}

          {/* Result Card */}
          {resultUrl && (
            <div className="mt-10 w-full bg-gradient-to-br from-red-100 to-gray-100 rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 text-red-500 flex items-center gap-2">Result <span className="text-2xl">✨</span></h2>
              <img src={resultUrl} alt="Object Removal Result" className="max-w-xs max-h-64 rounded-xl shadow border-2 border-red-200 bg-white" />
              <button
                onClick={handleDownload}
                className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition-colors"
              >
                Download Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIObjectRemoval; 