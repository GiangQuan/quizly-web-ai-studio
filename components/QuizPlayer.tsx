import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion, TimerMode } from '../types';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Award, ChevronLeft, Zap, Clock, Timer } from 'lucide-react';
import { sounds } from '../services/sound';

interface QuizPlayerProps {
  quiz: Quiz;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const timerMode: TimerMode = quiz.timerMode || 'per-question';
  const timeLimit = quiz.timeLimit || 30;
  
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  
  // State for animating the score number
  const [displayScore, setDisplayScore] = useState(0);

  const currentQuestion: QuizQuestion = quiz.questions[currentIndex];

  // Play completion sound when result is shown
  useEffect(() => {
    if (showResult) {
      sounds.playComplete();
    }
  }, [showResult]);

  // Reset timer when moving to next question ONLY if per-question mode
  useEffect(() => {
    if (timerMode === 'per-question') {
      setTimeLeft(timeLimit);
    }
  }, [currentIndex, timerMode, timeLimit]);

  // Main Timer Logic
  useEffect(() => {
    // Stop timer if quiz is finished
    if (showResult) return;
    
    // Stop timer if per-question mode and question is answered (pause for review)
    if (timerMode === 'per-question' && isAnswered) return;

    // Don't tick if time is already up
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          
          if (timerMode === 'per-question') {
             // Per-question timeout: Mark as answered (incorrect)
             setIsAnswered(true);
             sounds.playIncorrect();
             return 0;
          } else {
             // Total duration timeout: End the quiz immediately
             setShowResult(true);
             return 0;
          }
        }
        
        // Sound effect for low time (last 5 seconds)
        if (prev <= 6 && prev > 1) {
          sounds.playTick();
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, showResult, timerMode, timeLeft]);

  // Animation effect for score counting up
  useEffect(() => {
    if (showResult) {
      setDisplayScore(0);
      
      if (score === 0) return;

      const duration = 1000; // 1 second total animation
      // Calculate interval based on score to ensure consistent animation duration
      const intervalTime = Math.max(duration / score, 50); 
      
      let current = 0;
      const timer = setInterval(() => {
        current += 1;
        setDisplayScore(current);
        if (current >= score) clearInterval(timer);
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [showResult, score]);

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    sounds.playClick();
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isAnswered) return;

    setIsAnswered(true);
    const selectedOption = currentQuestion.options.find(o => o.id === selectedOptionId);
    if (selectedOption?.isCorrect) {
      setScore(prev => prev + 1);
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      sounds.playClick();
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      // NOTE: Timer reset for 'per-question' handled in useEffect
    } else {
      setShowResult(true);
    }
  };

  const handleRetake = () => {
      sounds.playClick();
      setShowResult(false);
      setCurrentIndex(0);
      setScore(0);
      setDisplayScore(0);
      setIsAnswered(false);
      setSelectedOptionId(null);
      setTimeLeft(timeLimit); // Reset timer for both modes
  };

  const handleExit = () => {
    sounds.playClick();
    onExit();
  }

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in pt-20">
        <div className="max-w-lg w-full text-center">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-lg p-10 border border-white/10 shadow-2xl relative overflow-hidden">
             {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
            
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] ring-4 ring-slate-900 relative z-10 rotate-3 animate-pulse-slow">
              <Award className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 font-display">Quiz Completed!</h2>
            {timerMode === 'total-duration' && timeLeft === 0 && (
                <p className="text-red-400 font-bold mb-2">Time's Up!</p>
            )}
            <p className="text-slate-400 mb-10 text-lg">You scored <span className="text-white font-bold text-2xl mx-1">{displayScore}</span> out of {quiz.questions.length}</p>
            
            <div className="w-full bg-slate-800 rounded-full h-3 mb-10 overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                style={{ width: `${(score / quiz.questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleExit}
                className="px-6 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg font-bold transition-all text-sm"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleRetake}
                className="px-6 py-3 bg-white text-black hover:bg-blue-50 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Visual calculations
  const progressPercentage = ((currentIndex) / quiz.questions.length) * 100;
  
  // Time Percentage Calculation
  const timePercentage = (timeLeft / timeLimit) * 100;
  const isTimeLow = timerMode === 'per-question' ? timeLeft <= 10 : timeLeft <= (timeLimit * 0.2);

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Fixed Header with Glass Effect */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/20 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-4 grid grid-cols-3 items-center">
          
          {/* Left: Exit */}
          <div className="justify-self-start">
            <button 
              onClick={handleExit} 
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors bg-slate-800/30 hover:bg-slate-800 px-3 py-2 rounded-lg border border-white/5 uppercase tracking-wider group"
            >
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
               <span className="hidden sm:inline">Exit</span>
            </button>
          </div>

          {/* Center: Question Counter */}
          <div className="justify-self-center w-full flex justify-center">
             <div className="bg-slate-900/40 backdrop-blur px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 text-sm font-bold text-slate-400 shadow-sm min-w-fit">
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider hidden sm:inline border-r border-white/10 pr-3 mr-1">Question</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white text-base">{currentIndex + 1}</span>
                    <span className="text-slate-600 text-xs">/</span>
                    <span className="text-slate-500 text-xs">{quiz.questions.length}</span>
                  </div>
              </div>
          </div>

          {/* Right: Timer */}
          <div className="justify-self-end">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border shadow-lg transition-all duration-300 ${
                isTimeLow 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse shadow-red-900/20' 
                  : 'bg-slate-900/40 border-blue-500/20 text-blue-100 shadow-blue-900/5'
              }`}>
                  <Timer className={`w-4 h-4 ${isTimeLow ? 'animate-bounce' : 'text-blue-400'}`} />
                  <span className="font-mono font-bold text-lg tabular-nums tracking-wider leading-none">
                      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </span>
                  {timerMode === 'total-duration' && (
                    <span className="hidden sm:inline text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 border-l border-white/10 pl-2">
                      Total
                    </span>
                  )}
              </div>
          </div>
        </div>

        {/* Timer Bar (Visual Indicator at bottom of header) - Fullscreen Width due to fixed parent */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800/30">
             <div 
               className={`h-full transition-all duration-1000 linear ${isTimeLow ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
               style={{ width: `${timePercentage}%` }}
             />
        </div>
      </div>

      {/* Scrollable Content Area with Top Padding to account for fixed header */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 pt-24 md:pt-28 overflow-y-auto">
        <div className="max-w-4xl w-full">
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/5 relative flex flex-col mb-10">
            {/* Progress bar for Questions */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800/30 z-20">
                 <div 
                   className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                   style={{ width: `${progressPercentage}%` }}
                 />
            </div>

            {/* Image Area */}
            {currentQuestion.imageUrl && (
              <div className="w-full h-56 md:h-80 bg-slate-950 relative shrink-0 group">
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                 <img 
                   src={currentQuestion.imageUrl} 
                   alt="Question" 
                   className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                 />
              </div>
            )}

            {/* Question Area */}
            <div className="p-6 md:p-10 relative z-20">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight tracking-tight font-display">
                {currentQuestion.text}
              </h3>

              <div className="grid gap-3">
                {currentQuestion.options.map((option) => {
                  let buttonStyle = "border-transparent bg-slate-800/30 hover:bg-slate-800 text-slate-300 shadow-sm";
                  let icon = null;

                  if (isAnswered) {
                    if (option.isCorrect) {
                      buttonStyle = "border-green-500/20 bg-green-500/10 text-green-400 ring-1 ring-green-500/30";
                      icon = <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />;
                    } else if (selectedOptionId === option.id) {
                      buttonStyle = "border-red-500/20 bg-red-500/10 text-red-400 ring-1 ring-red-500/30";
                      icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
                    } else {
                      buttonStyle = "border-transparent opacity-40 bg-slate-900/20";
                    }
                  } else if (selectedOptionId === option.id) {
                    buttonStyle = "bg-blue-600 text-white shadow-lg shadow-blue-900/20 scale-[1.01]";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-200 flex justify-between items-center group ${buttonStyle}`}
                    >
                      <span className="font-medium text-base md:text-lg">{option.text}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Action Area */}
              <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[70px]">
                {isAnswered && currentQuestion.explanation ? (
                   <div className="bg-blue-900/10 p-4 rounded-xl w-full border border-blue-500/10 animate-slide-up">
                     <p className="text-sm text-blue-100/80 leading-relaxed">
                       <span className="font-bold text-blue-400 block mb-1 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                         <Zap className="w-3 h-3" /> Insight
                       </span>
                       {currentQuestion.explanation}
                     </p>
                   </div>
                ) : (
                  <div className="hidden md:block"></div>
                )}

                {!isAnswered ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedOptionId}
                    className="w-full md:w-auto px-8 py-3.5 bg-white text-black disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-xl font-bold hover:bg-blue-50 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-white/5 text-sm md:text-base whitespace-nowrap"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full md:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base whitespace-nowrap"
                  >
                    {currentIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
