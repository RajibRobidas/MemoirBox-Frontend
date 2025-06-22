import React, { useState, useRef } from 'react';

const MODELSLAB_URL = 'https://modelslab.com/api/v6/interior/make';
const MODELSLAB_KEY = process.env.REACT_APP_MODELSLAB_KEY;

const AIInteriorDesign: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      // Prepare request body (as you provided)
      const body = {
        key: MODELSLAB_KEY,
        init_image: base64Image,
        prompt: prompt || 'Modern cozy living room with two beige velvet armchairs, soft rug, gold floor lamp, abstract red painting, elegant wall paneling, and natural light through beige curtains',
        negative_prompt: '(normal quality), (low quality), (worst quality), sketches, fog, signature, soft, blurry, drawing, sketch, poor quality, ugly text, type, word, logo, pixelated, low resolution, saturated, high contrast, over sharpened, dirt',
        seed: 0,
        guidance_scale: 8,
        strength: 0.99,
        num_inference_steps: 51,
        base64: true,
        temp: false,
        scale_down: 1,
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
      if (data.status === 'success' && Array.isArray(data.output) && data.output.length > 0) {
        setResultUrl(data.output[0]);
      } else {
        throw new Error(data.message || 'Interior design generation failed.');
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
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'interior-design.png';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download image. Please try right-clicking and saving manually.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cyan-100 via-white to-gray-100 flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-strong p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-8 -left-8 text-[7rem] opacity-10 pointer-events-none select-none">🏛️</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-cyan-600 drop-shadow-lg flex items-center gap-2">
            <span className="inline-block">Architecture & Interior</span>
          </h1>
          <p className="text-text-secondary mb-8 text-center max-w-md">Upload a photo and let AI redesign your space in a modern, cozy style. Download your new interior design in seconds!</p>

          {/* Upload Area */}
          {!previewUrl && (
            <div
              className="w-full bg-gradient-to-br from-cyan-100 to-gray-100 border-2 border-dashed border-cyan-300 rounded-2xl flex flex-col items-center justify-center py-12 cursor-pointer hover:shadow-lg transition-all duration-200 mb-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-5xl mb-2">🖼️</div>
              <div className="text-lg font-medium text-cyan-600 mb-1">Click to Upload</div>
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
                <img src={previewUrl} alt="Preview" className="max-w-xs max-h-64 rounded-2xl shadow-lg border-2 border-cyan-200 bg-white" />
              </div>
            </div>
          )}

          {/* Form Button */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            {previewUrl && (
              <>
                <input
                  type="text"
                  className="w-full rounded-lg border border-cyan-300 p-2 text-base focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-2"
                  placeholder="Enter your prompt (e.g. modern cozy living room...)"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md hover:from-cyan-600 hover:to-cyan-400 transition-all duration-200 disabled:opacity-60"
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                      Processing...
                    </span>
                  ) : (
                    'Redesign Interior'
                  )}
                </button>
              </>
            )}
          </form>

          {/* Error Message */}
          {error && <div className="mt-4 text-red-600 text-center font-medium">{error}</div>}

          {/* Result Card */}
          {resultUrl && (
            <div className="mt-10 w-full bg-gradient-to-br from-cyan-100 to-gray-100 rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 text-cyan-600 flex items-center gap-2">Result <span className="text-2xl">✨</span></h2>
              <img src={resultUrl} alt="Interior Design Result" className="max-w-xs max-h-64 rounded-xl shadow border-2 border-cyan-200 bg-white" />
              <button
                onClick={handleDownload}
                className="mt-6 bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-cyan-700 transition-colors"
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

export default AIInteriorDesign; 