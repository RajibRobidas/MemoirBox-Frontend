import React, { useState, useRef } from 'react';

const MODELSLAB_URL = 'https://modelslab.com/api/v6/images/img2img';
const MODELSLAB_KEY = process.env.REACT_APP_MODELSLAB_KEY;

const AIImageToImage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initImageUrl, setInitImageUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

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
    setLoading(true);
    setError(null);
    setResultUrl(null);
    try {
      let initImage: string | null = null;
      let base64 = false;
      if (selectedFile) {
        initImage = await fileToBase64(selectedFile);
        base64 = true;
      } else if (initImageUrl) {
        initImage = initImageUrl;
        base64 = false;
      }
      if (!initImage) throw new Error('Please provide an input image (file or URL).');
      const body = {
        key: MODELSLAB_KEY,
        prompt: prompt || 'A Godzilla monster towering over a city, with large black spikes along its back, a big black eye, and a prominent horn on its nose. The monster is gray with bold black outlines. Surrounding it are tall gray buildings with bright orange windows. Light blue clouds fill the sky, and several airplanes or missiles are flying near the monster. The overall style is playful, childlike, and imaginative.',
        negative_prompt: 'bad quality',
        init_image: initImage,
        width: '512',
        height: '512',
        samples: '1',
        temp: false,
        safety_checker: false,
        strength: 0.7,
        seed: null,
        webhook: null,
        track_id: null,
        base64,
      };
      const response = await fetch('https://modelslab.com/api/v6/realtime/img2img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.output) && data.output.length > 0) {
        let output = data.output[0];
        // Check if output is a base64 string (not a URL)
        if (typeof output === 'string' && !output.startsWith('http')) {
          // Assume PNG if not specified
          output = `data:image/png;base64,${output}`;
        }
        setResultUrl(output);
      } else if (data.status === 'processing') {
        setError('Image is processing. Please try again in a few seconds.');
      } else {
        throw new Error(data.message || 'Image-to-image generation failed.');
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
      if (resultUrl.startsWith('data:image/')) {
        // For base64 images, create a link and trigger download
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'image-to-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For URLs, fetch and download as before
        const response = await fetch(resultUrl, { mode: 'cors' });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image-to-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert('Failed to download image. Please try right-clicking and saving manually.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-white to-gray-100 flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-strong p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-8 -left-8 text-[7rem] opacity-10 pointer-events-none select-none">🔄</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-pink-600 drop-shadow-lg flex items-center gap-2">
            <span className="inline-block">Image to Image</span>
          </h1>
          <p className="text-text-secondary mb-8 text-center max-w-md">Transform one image into another with AI magic. Upload a photo and see the transformation!</p>

          {/* Upload Area */}
          {!previewUrl && (
            <div
              className="w-full bg-gradient-to-br from-pink-100 to-gray-100 border-2 border-dashed border-pink-300 rounded-2xl flex flex-col items-center justify-center py-12 cursor-pointer hover:shadow-lg transition-all duration-200 mb-6"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="text-5xl mb-2">🖼️</div>
              <div className="text-lg font-medium text-pink-600 mb-1">Click or Drag & Drop to Upload</div>
              <div className="text-text-secondary text-sm">PNG, JPG, JPEG, up to 5MB</div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                disabled={loading}
              />
              <div className="w-full mt-4">
                <input
                  type="text"
                  className="w-full rounded-lg border border-pink-300 p-2 text-base focus:ring-2 focus:ring-pink-400 focus:outline-none mb-2"
                  placeholder="Or paste an image URL here..."
                  value={initImageUrl}
                  onChange={e => setInitImageUrl(e.target.value)}
                  disabled={loading}
                />
                <input
                  type="text"
                  className="w-full rounded-lg border border-pink-300 p-2 text-base focus:ring-2 focus:ring-pink-400 focus:outline-none mt-2"
                  placeholder="Enter your prompt (e.g. a cat sitting on a bench)"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Preview Area */}
          {(previewUrl || (initImageUrl && !previewUrl)) && (
            <div className="mb-6 w-full flex flex-col items-center">
              <div className="relative w-full flex flex-col items-center">
                <img src={previewUrl || initImageUrl} alt="Preview" className="max-w-xs max-h-64 rounded-2xl shadow-lg border-2 border-pink-200 bg-white" />
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 bg-white/80 text-pink-600 rounded-full p-2 shadow hover:bg-pink-50 transition-colors"
                    title="Remove"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form Button */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            {(previewUrl || (initImageUrl && !previewUrl)) && (
              <>
                <input
                  type="text"
                  className="w-full rounded-lg border border-pink-300 p-2 text-base focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  placeholder="Enter your prompt (e.g. a cat sitting on a bench)"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  disabled={loading}
                  style={{ marginBottom: '1rem' }}
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md hover:from-pink-600 hover:to-pink-400 transition-all duration-200 disabled:opacity-60"
                  disabled={(!selectedFile && !initImageUrl) || !prompt || loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                      Processing...
                    </span>
                  ) : (
                    'Transform Image'
                  )}
                </button>
              </>
            )}
          </form>

          {/* Error Message */}
          {error && <div className="mt-4 text-red-600 text-center font-medium">{error}</div>}

          {/* Result Card */}
          {resultUrl && (
            <div className="mt-10 w-full bg-gradient-to-br from-pink-100 to-gray-100 rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 text-pink-600 flex items-center gap-2">Result <span className="text-2xl">✨</span></h2>
              <img src={resultUrl} alt="Image to Image Result" className="max-w-xs max-h-64 rounded-xl shadow border-2 border-pink-200 bg-white" />
              <button
                onClick={handleDownload}
                className="mt-6 bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-pink-700 transition-colors"
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

export default AIImageToImage; 