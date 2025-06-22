import React, { useState, useRef } from 'react';

const MODELSLAB_URL = 'https://modelslab.com/api/v6/realtime/text2img';
const MODELSLAB_KEY = process.env.REACT_APP_MODELSLAB_KEY;

const AITextToImage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(
    'A minion from despicable me, red skin, Darth Maul like spikes on head, dressed in a dark Sith lord robe, Dark Jedi, (one eye:1.2), angry expression, scowling, (looking at viewer:1.1), holding a red lightsaber, pitch black background only illuminated by red lightsaber, perfect lightsaber, lightsaber pointed at viewer, Highest quality, masterpiece, 4k, concept art'
  );
  const [negativePrompt, setNegativePrompt] = useState<string>(
    '(worst quality:2), (low quality:2), (normal quality:2), (jpeg artifacts), (blurry), (duplicate), (morbid), (mutilated), (out of frame), (extra limbs), (bad anatomy), (disfigured), (deformed), (cross-eye), (glitch), (oversaturated), (overexposed), (underexposed), (bad proportions), (bad hands), (bad feet), (cloned face), (long neck), (missing arms), (missing legs), (extra fingers), (fused fingers), (poorly drawn hands), (poorly drawn face), (mutation), (deformed eyes), watermark, text, logo, signature, grainy, tiling, censored, nsfw, ugly, blurry eyes, noisy image, bad lighting, unnatural skin, asymmetry'
  );
  
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultUrl(null);
    try {
      const body = {
        key: MODELSLAB_KEY,
        prompt,
        negative_prompt: negativePrompt,
        width: '512',
        height: '512',
        safety_checker: false,
        seed: null,
        samples: 1,
        base64: false,
        webhook: null,
        track_id: null,
      };
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
      } else if (data.status === 'processing') {
        setError('Image is processing. Please try again in a few seconds.');
      } else {
        throw new Error(data.message || 'Text-to-image generation failed.');
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
      link.download = 'text-to-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download image. Please try right-clicking and saving manually.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-accent/10 via-white to-gray-100 flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-strong p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-8 -left-8 text-[7rem] opacity-10 pointer-events-none select-none">📝</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-accent drop-shadow-lg flex items-center gap-2">
            <span className="inline-block">Text to Image</span>
          </h1>
          <p className="text-text-secondary mb-8 text-center max-w-md">Generate images from text prompts using AI. Enter your prompt and see the magic!</p>

          {/* Prompt Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4 mb-6">
            <textarea
              className="w-full rounded-lg border border-accent/30 p-3 text-base focus:ring-2 focus:ring-accent focus:outline-none resize-none"
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              required
            />
            {/* <p className="text-sm text-text-secondary">Negative Prompt (optional)</p>
            <textarea
              className="w-full rounded-lg border border-accent/10 p-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none resize-none"
              rows={2}
              value={negativePrompt}
              onChange={e => setNegativePrompt(e.target.value)}
              placeholder="Negative prompt (optional)"
            /> */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-accent-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md hover:from-accent-600 hover:to-accent transition-all duration-200 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Generating...
                </span>
              ) : (
                'Generate Image'
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && <div className="mt-4 text-red-600 text-center font-medium">{error}</div>}

          {/* Result Card */}
          {resultUrl && (
            <div className="mt-6 w-full bg-gradient-to-br from-accent/10 to-gray-100 rounded-2xl shadow-lg p-6 flex flex-col items-center animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 text-accent flex items-center gap-2">Result <span className="text-2xl">✨</span></h2>
              <img src={resultUrl} alt="Text to Image Result" className="max-w-xs max-h-64 rounded-xl shadow border-2 border-accent/20 bg-white" />
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

export default AITextToImage; 