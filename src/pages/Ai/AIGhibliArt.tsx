import React, { useState, useRef } from 'react';

const MODELSLAB_URL = 'https://modelslab.com/api/v5/controlnet';
const MODELSLAB_KEY = process.env.REACT_APP_MODELSLAB_KEY;

const AIGhibliArt: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
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
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResultUrl(null);
    try {
      // Convert image to base64
      const base64Image = await fileToBase64(selectedFile);
      // Prepare request body
      const body = {
        key: MODELSLAB_KEY,
        model_id: 'fluxdev',
        init_image: base64Image,
        prompt: 'Ghibli Studio style, Charming hand-drawn anime-style illustration',
        controlnet_type: 'ghibli',
        controlnet_model: 'ghibli',
        height: '1024',
        width: '1024',
        base64: true,
        temp: 'no',
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
        throw new Error(data.message || 'Ghibli art generation failed.');
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
      link.download = 'ghibli-art.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download image. Please try right-clicking and saving manually.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-strong p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-8 -left-8 text-[7rem] opacity-10 pointer-events-none select-none">🌸</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-pink-500 drop-shadow-lg flex items-center gap-2">
            <span className="inline-block">Ghibli-Art Style</span>
          </h1>
          <p className="text-text-secondary mb-8 text-center max-w-md">Turn your photos into charming hand-drawn Ghibli-style anime art. Upload a photo and let the AI work its magic!</p>

          {/* Upload Area */}
          {!previewUrl && (
            <div
              className="w-full bg-gradient-to-br from-yellow-100 to-pink-100 border-2 border-dashed border-pink-300 rounded-2xl flex flex-col items-center justify-center py-12 cursor-pointer hover:shadow-lg transition-all duration-200 mb-6"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="text-5xl mb-2">🖼️</div>
              <div className="text-lg font-medium text-pink-500 mb-1">Click or Drag & Drop to Upload</div>
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
                <img src={previewUrl} alt="Preview" className="max-w-xs max-h-64 rounded-2xl shadow-lg border-2 border-pink-200 bg-white" />
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
            </div>
          )}

          {/* Form Button */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            {previewUrl && (
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md hover:from-pink-600 hover:to-pink-400 transition-all duration-200 disabled:opacity-60"
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </span>
                ) : (
                  'Generate Ghibli Art'
                )}
              </button>
            )}
          </form>

          {/* Error Message */}
          {error && <div className="mt-4 text-red-600 text-center font-medium">{error}</div>}

          {/* Result Card */}
          {resultUrl && (
            <div className="mt-10 w-full bg-gradient-to-br from-yellow-100 to-pink-100 rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 text-pink-500 flex items-center gap-2">Result <span className="text-2xl">✨</span></h2>
              <img src={resultUrl} alt="Ghibli Art Result" className="max-w-xs max-h-64 rounded-xl shadow border-2 border-pink-200 bg-white" />
              <button
                onClick={handleDownload}
                className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-pink-600 transition-colors"
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

export default AIGhibliArt; 