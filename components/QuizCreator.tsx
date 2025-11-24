import React, { useState, useEffect, useRef } from 'react';
import { Quiz, QuizQuestion, QuizOption, TimerMode } from '../types';
import { generateQuizWithGemini } from '../services/gemini';
import { Plus, Trash2, Save, BrainCircuit, Wand2, Upload, Loader2, Sparkles, ChevronLeft, Image as ImageIcon, Clock, Timer, Settings2, FileText, X } from 'lucide-react';
import { ImageGeneratorModal } from './ImageGeneratorModal';

// Simple UUID generator replacement
const uuid = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

interface QuizCreatorProps {
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
  initialQuiz?: Quiz;
}

export const QuizCreator: React.FC<QuizCreatorProps> = ({ onSave, onCancel, initialQuiz }) => {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  
  // Manual State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  // Timer Settings
  const [timerMode, setTimerMode] = useState<TimerMode>('per-question');
  const [timeLimit, setTimeLimit] = useState<number>(30);
  
  // AI State
  const [aiTopic, setAiTopic] = useState('');
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [aiNumQuestions, setAiNumQuestions] = useState<number | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Gen Modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuiz) {
      setTitle(initialQuiz.title);
      setDescription(initialQuiz.description);
      setQuestions(initialQuiz.questions);
      setTimerMode(initialQuiz.timerMode || 'per-question');
      setTimeLimit(initialQuiz.timeLimit || 30);
      setMode('manual');
    } else {
      // Initialize with one empty question if new
      setQuestions([{
        id: uuid(),
        text: '',
        options: [
          { id: uuid(), text: '', isCorrect: false },
          { id: uuid(), text: '', isCorrect: false },
        ]
      }]);
    }
  }, [initialQuiz]);

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: uuid(),
      text: '',
      options: [
        { id: uuid(), text: '', isCorrect: false },
        { id: uuid(), text: '', isCorrect: false },
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId: string, oId: string, field: keyof QuizOption, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      return {
        ...q,
        options: q.options.map(o => o.id === oId ? { ...o, [field]: value } : o)
      };
    }));
  };

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      return { ...q, options: [...q.options, { id: uuid(), text: '', isCorrect: false }] };
    }));
  };

  const removeOption = (qId: string, oId: string) => {
    setQuestions(questions.map(q => {
      if (q.id !== qId) return q;
      return { ...q, options: q.options.filter(o => o.id !== oId) };
    }));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, qId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion(qId, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAiFile(file);
    }
  };

  const handleImageGenSelected = (base64: string) => {
    if (activeQuestionId) {
      updateQuestion(activeQuestionId, 'imageUrl', base64);
    }
    setActiveQuestionId(null);
  };

  const handleSave = () => {
    if (!title || questions.length === 0) return;
    const newQuiz: Quiz = {
      id: initialQuiz ? initialQuiz.id : uuid(),
      title,
      description,
      topic: mode === 'ai' ? (aiTopic || (aiFile ? `Analysis of ${aiFile.name}` : 'Generated Quiz')) : (initialQuiz?.topic || 'Custom'),
      createdAt: initialQuiz ? initialQuiz.createdAt : Date.now(),
      questions,
      timerMode,
      timeLimit
    };
    onSave(newQuiz);
  };

  const handleAiGenerate = async () => {
    if (!aiTopic && !aiFile) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      let fileData = undefined;

      if (aiFile) {
        fileData = await new Promise<{ mimeType: string, data: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove data url prefix (e.g. "data:application/pdf;base64,")
            const base64Content = base64String.split(',')[1];
            resolve({
              mimeType: aiFile.type,
              data: base64Content
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(aiFile);
        });
      }

      const numQ = aiNumQuestions === '' ? undefined : Number(aiNumQuestions);
      
      // Gemini generation
      const result = await generateQuizWithGemini(aiTopic, fileData, numQ);
      
      setTitle(result.title || `Quiz about ${aiTopic || aiFile?.name}`);
      setDescription(result.description || 'Generated by Gemini');
      
      const mappedQuestions: QuizQuestion[] = (result.questions || []).map((q: any) => ({
        id: uuid(),
        text: q.text,
        explanation: q.explanation,
        options: q.options.map((o: any) => ({
          id: uuid(),
          text: o.text,
          isCorrect: o.isCorrect
        }))
      }));

      setQuestions(mappedQuestions);
      setMode('manual'); // Switch to manual mode so user can review/edit
    } catch (e) {
      console.error(e);
      setAiError("Failed to generate quiz. Please try again or check your document.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8 animate-fade-in pb-24">
      <div className="py-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-white mb-2 transition-colors text-sm font-medium">
             <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
           </button>
           <h2 className="text-2xl font-bold text-white tracking-tight font-display">{initialQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h2>
        </div>
        
        {!initialQuiz && (
          /* Segmented Control - Only show for new quizzes */
          <div className="flex bg-slate-900 p-1 rounded-lg border border-white/10 relative self-start md:self-auto">
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 relative z-10 ${mode === 'manual' ? 'text-white bg-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Manual
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 relative z-10 flex items-center gap-2 ${mode === 'ai' ? 'text-white bg-blue-900/50 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              AI Auto
            </button>
          </div>
        )}
      </div>

      {mode === 'ai' ? (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 md:p-12 text-center max-w-2xl mx-auto border border-white/5 shadow-2xl shadow-black/20 mt-6 md:mt-12 animate-slide-up">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-blue-500/20">
            <BrainCircuit className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 font-display">Generate with AI</h3>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed max-w-md mx-auto">
            Upload a document or enter a topic. Gemini will analyze the content and "Think" deeply to create structured questions.
          </p>
          
          <div className="space-y-4 text-left">
            {/* Topic Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Topic {aiFile ? '(Optional)' : '(Required)'}</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., The History of Coffee"
                className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-lg px-5 py-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                disabled={isGenerating}
              />
            </div>

            {/* File Input Area */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Source Document (Optional)</label>
              {!aiFile ? (
                <div 
                  onClick={() => !isGenerating && fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center transition-all group ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/50 hover:bg-slate-800/50 cursor-pointer'}`}
                >
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 mb-2 transition-colors" />
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200">Click to upload document</span>
                  <span className="text-xs text-slate-600 mt-1">PDF, DOC, TXT, CSV, or Images</span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".pdf,.txt,.doc,.docx,.csv,.md,image/*"
                    onChange={handleAiFileChange}
                    disabled={isGenerating}
                  />
                </div>
              ) : (
                <div className="bg-slate-800/80 rounded-lg p-3 flex items-center justify-between border border-blue-500/30">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-blue-500/20 rounded-md">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-white truncate">{aiFile.name}</span>
                      <span className="text-xs text-slate-400">{(aiFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { if(!isGenerating) { setAiFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}}
                    className="p-1.5 hover:bg-slate-700 rounded-md text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isGenerating}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

             {/* Question Count */}
             <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Number of Questions (Optional)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={aiNumQuestions}
                onChange={(e) => setAiNumQuestions(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="Auto (Gemini decides)"
                className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-lg px-5 py-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleAiGenerate}
              disabled={isGenerating || (!aiTopic && !aiFile)}
              className={`w-full px-6 py-3.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                isGenerating 
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500"/> 
                  <span>Creating your quiz...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5"/>
                  <span>Generate Quiz</span>
                </>
              )}
            </button>
            {isGenerating && (
              <p className="text-center text-xs text-slate-500 mt-3 animate-pulse">
                Gemini is thinking... (This may take up to 30s)
              </p>
            )}
          </div>

          {aiError && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{aiError}</div>}
          
          <div className="mt-6 flex justify-center">
             <div className="bg-slate-800/50 px-3 py-1.5 rounded-md flex items-center gap-2 border border-white/5">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Gemini 3 Pro Multimodal</span>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-white/5">
             <div className="grid gap-6">
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Quiz Title</label>
                 <input
                   type="text"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-white focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 placeholder-slate-600 text-lg font-medium transition-colors"
                   placeholder="Enter quiz title..."
                 />
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Description</label>
                 <textarea
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 text-white focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 placeholder-slate-600 resize-none transition-colors"
                   placeholder="Short description..."
                   rows={2}
                 />
               </div>

               {/* Timer Settings */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-800/30 rounded-lg border border-white/5">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1.5">
                      <Settings2 className="w-3 h-3" /> Timer Mode
                    </label>
                    <div className="flex gap-2 h-11">
                       <button
                         onClick={() => setTimerMode('per-question')}
                         className={`flex-1 h-full rounded-lg text-xs font-bold transition-all flex items-center justify-center ${timerMode === 'per-question' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-slate-300'}`}
                       >
                         Per Question
                       </button>
                       <button
                         onClick={() => setTimerMode('total-duration')}
                         className={`flex-1 h-full rounded-lg text-xs font-bold transition-all flex items-center justify-center ${timerMode === 'total-duration' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-slate-300'}`}
                       >
                         Total Quiz
                       </button>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1.5">
                      <Timer className="w-3 h-3" /> Time Limit (Seconds)
                    </label>
                    <div className="relative h-11">
                       <input
                         type="number"
                         min="5"
                         max="3600"
                         value={timeLimit}
                         onChange={(e) => setTimeLimit(Math.max(5, parseInt(e.target.value) || 0))}
                         className="w-full h-full bg-slate-800 border-none rounded-lg px-4 text-white focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 font-mono text-center font-bold"
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">SEC</span>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-slate-900/50 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-white/5 relative group transition-all hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-900/5 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => removeQuestion(q.id)} className="bg-slate-800 text-slate-400 hover:text-red-400 p-2 rounded-md transition-colors hover:bg-slate-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                     <span className="bg-blue-900/30 text-blue-300 text-xs font-bold px-2 py-1 rounded border border-blue-500/20">Q{index + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-xl font-bold text-white focus:ring-0 placeholder-slate-600"
                    placeholder="Type your question here..."
                  />
                  
                  {/* Image Actions - Sleeker Implementation */}
                  {!q.imageUrl && (
                    <div className="flex items-center gap-3 mt-3">
                       <label className="cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Add Photo</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, q.id)} />
                       </label>
                       <button 
                         onClick={() => { setActiveQuestionId(q.id); setIsImageModalOpen(true); }}
                         className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-900/20 border border-transparent hover:border-blue-500/20"
                       >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate with AI</span>
                       </button>
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {q.imageUrl && (
                   <div className="mb-6 relative w-full h-56 rounded-lg overflow-hidden group/image border border-white/10 bg-black/50">
                     <img src={q.imageUrl} alt="Question" className="w-full h-full object-contain" />
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button 
                          onClick={() => updateQuestion(q.id, 'imageUrl', undefined)}
                          className="bg-red-500/20 border border-red-500/50 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wide"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Image
                        </button>
                     </div>
                   </div>
                )}

                <div className="space-y-3 mt-6 pt-6 border-t border-white/5">
                  {q.options.map((opt, oIndex) => (
                    <div key={opt.id} className="flex items-center gap-3 group/option">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={opt.isCorrect}
                          onChange={() => {
                            const newOptions = q.options.map(o => ({ ...o, isCorrect: o.id === opt.id }));
                            updateQuestion(q.id, 'options', newOptions);
                          }}
                          className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded checked:border-green-500 checked:bg-green-500 transition-all cursor-pointer hover:border-slate-400"
                        />
                      </div>
                      
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => updateOption(q.id, opt.id, 'text', e.target.value)}
                        className={`flex-1 bg-slate-800 border-none rounded-lg py-2.5 px-3 focus:ring-0 focus:bg-slate-700 text-slate-300 transition-colors text-sm ${opt.isCorrect ? 'text-green-400 font-medium ring-1 ring-green-500/30' : ''}`}
                        placeholder={`Option ${oIndex + 1}`}
                      />
                      <button onClick={() => removeOption(q.id, opt.id)} className="text-slate-600 hover:text-red-400 opacity-100 md:opacity-0 md:group-hover/option:opacity-100 transition-opacity p-1.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addOption(q.id)} className="text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center gap-1.5 mt-3 ml-8 transition-colors">
                    <Plus className="w-3 h-3" /> Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddQuestion}
            className="w-full py-4 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:border-slate-500 hover:bg-slate-800/50 hover:text-slate-300 transition-all flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wide"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-8">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-slate-400 font-bold text-sm hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 text-sm"
            >
              <Save className="w-4 h-4" />
              Save Quiz
            </button>
          </div>
        </div>
      )}

      <ImageGeneratorModal 
        isOpen={isImageModalOpen} 
        onClose={() => setIsImageModalOpen(false)} 
        onImageSelected={handleImageGenSelected} 
      />
    </div>
  );
};
