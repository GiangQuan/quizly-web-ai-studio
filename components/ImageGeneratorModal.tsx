import React, { useState } from 'react';
import { generateQuizImage } from '../services/gemini';
import { ImageSize } from '../types';
import { Loader2, X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (base64Image: string) => void;
}

export const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ isOpen, onClose, onImageSelected }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.Size_1K);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64 = await generateQuizImage(prompt, size);
      setGeneratedImage(base64);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (generatedImage) {
      onImageSelected(generatedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-white/10 relative z-10 animate-slide-up">
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-slate-900/50">
          <h3 className="text-lg font-bold flex items-center gap-2 text-white font-display">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Nano Banana Pro Studio
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-700 p-1.5 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Image Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want (e.g., A futuristic robot holding a red quiz buzzer)"
              className="w-full bg-slate-800 border-none rounded-lg p-4 text-white focus:ring-1 focus:ring-blue-500 focus:bg-slate-700 min-h-[100px] resize-none placeholder-slate-500 text-base leading-relaxed transition-colors"
            />
          </div>

          <div>
             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Resolution</label>
            <div className="flex gap-2 p-1 bg-slate-800 rounded-lg inline-flex">
              {(Object.values(ImageSize) as ImageSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    size === s
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          {generatedImage && (
            <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center group shadow-lg">
              <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
            </div>
          )}

           {loading && (
            <div className="flex flex-col items-center justify-center py-8 bg-slate-800/30 rounded-lg border border-white/5 border-dashed">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
              <p className="text-slate-400 text-xs font-medium">Dreaming up your image...</p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-white/5 bg-slate-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-slate-500 hover:text-white font-bold text-sm transition-colors"
          >
            Cancel
          </button>
          {!generatedImage ? (
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="px-5 py-2.5 bg-white text-black hover:bg-blue-50 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-lg font-bold flex items-center gap-2 transition-all text-sm"
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          ) : (
             <button
              onClick={handleAccept}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all text-sm"
            >
              Use This Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};