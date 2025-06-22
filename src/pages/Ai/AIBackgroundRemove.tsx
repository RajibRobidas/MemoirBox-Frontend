import React, { useState, useRef } from 'react';

const MODELSLAB_URL = 'https://modelslab.com/api/v6/image_editing/removebg_mask';
const MODELSLAB_KEY = process.env.REACT_APP_MODELSLAB_KEY;

const AIBackgroundRemove: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [waitingMsg, setWaitingMsg] = useState<string | null>(null);

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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const pollForResult = async (fetchUrl: string, delay: number = 5) => {
    setWaitingMsg(`Processing… retrying in ${delay} sec`);
    await new Promise(res => setTimeout(res, delay * 1000));
    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: MODELSLAB_KEY }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setResultUrl(data.output?.[0]);
        setWaitingMsg(null);
      } else if (data.status === 'processing') {
        pollForResult(fetchUrl, data.eta || 5);
      } else {
        setError(data.message || 'Background removal failed.');
        setWaitingMsg(null);
      }
    } catch (err: any) {
      setError(err.message || 'Polling error.');
      setWaitingMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResultUrl(null);
    setWaitingMsg(null);
    setLoading(true);

    try {
      let image: string | null = null;
      let base64 = false;

      if (selectedFile) {
        image = await fileToBase64(selectedFile);
        base64 = true;
      } else if (imageUrl) {
        image = imageUrl;
        base64 = false;
      } else {
        throw new Error('Please upload a file or provide an image URL.');
      }

      const body = {
        key: MODELSLAB_KEY,
        image,
        base64,
        post_process_mask: false,
        only_mask: false,
        alpha_matting: false,
        webhook: null,
        track_id: null,
      };

      const response = await fetch(MODELSLAB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResultUrl(data.output?.[0]);
      } else if (data.status === 'processing' && data.fetch_result) {
        pollForResult(data.fetch_result, data.eta || 5);
      } else {
        throw new Error(data.message || 'API request failed.');
      }

    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    const response = await fetch(resultUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'no-background.png';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-accent/10 via-surface to-light flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-strong p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-8 -left-8 text-[7rem] opacity-10 pointer-events-none select-none">🧹</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-accent drop-shadow-lg flex items-center gap-2">
            <span className="inline-block">Remove Image Background</span>
          </h1>
          <p className="text-text-secondary mb-8 text-center max-w-md">Upload a photo and let AI magically erase the background. Download your new transparent image in seconds!</p>

          {/* Upload Area */}
          {!previewUrl && (
            <div
              className="w-full bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-dashed border-accent/30 rounded-2xl flex flex-col items-center justify-center py-12 cursor-pointer hover:shadow-lg transition-all duration-200 mb-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-5xl mb-2">📤</div>
              <div className="text-lg font-medium text-accent mb-1">Click or Drag & Drop to Upload</div>
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
                  className="w-full rounded-lg border border-accent/30 p-2 text-base focus:ring-2 focus:ring-accent focus:outline-none"
                  placeholder="Or paste an image URL here..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Preview Area */}
          {previewUrl && (
            <div className="mb-6 w-full flex flex-col items-center">
              <div className="relative w-full flex flex-col items-center">
                <img src={previewUrl} alt="Preview" className="max-w-xs max-h-64 rounded-2xl shadow-lg border-2 border-accent/20 bg-white" />
              </div>
            </div>
          )}

          {/* Form Button */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            {(previewUrl || imageUrl) && (
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-accent to-accent-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md hover:from-accent-600 hover:to-accent transition-all duration-200 disabled:opacity-60"
                disabled={(!selectedFile && !imageUrl) || loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </span>
                ) : (
                  'Remove Background'
                )}
              </button>
            )}
          </form>

          {/* Error Message */}
          {error && <div className="mt-4 text-red-600 text-center font-medium">{error}</div>}
          {/* Waiting Message */}
          {waitingMsg && (
            <div className="mt-4 text-accent text-center font-medium animate-pulse">{waitingMsg}</div>
          )}

          {/* Result Card */}
          {resultUrl && (
            <div className="mt-10 w-full bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 text-accent flex items-center gap-2">Result <span className="text-2xl">✨</span></h2>
              <img src={resultUrl} alt="Result" className="max-w-xs max-h-64 rounded-xl shadow border-2 border-accent/20 bg-white" />
              <button
                onClick={handleDownload}
                className="mt-6 bg-accent text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-accent-600 transition-colors"
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

export default AIBackgroundRemove; 