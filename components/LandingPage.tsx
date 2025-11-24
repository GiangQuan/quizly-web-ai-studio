import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BrainCircuit, Trophy, ArrowRight, Zap, Globe, Shield } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-100 flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-0"></div>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[100px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 w-full max-w-[1200px] mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight">Quizly</span>
        </div>
        <button 
          onClick={handleGetStarted}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-lg font-bold text-sm transition-all hover:border-slate-600"
        >
          Launch App
        </button>
      </nav>

      {/* Top Fold / Hero */}
      <header className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-10 pb-20 md:pt-20 md:pb-32 max-w-5xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Powered by Gemini 3 Pro
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 drop-shadow-sm animate-slide-up">
          Master any topic <br />
          <span className="text-indigo-400">in seconds.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Upload documents or pick a topic. Our AI generates interactive quizzes instantly to help you learn faster and retain more.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button 
            onClick={handleGetStarted}
            className="px-8 py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-indigo-50 transition-all transform hover:-translate-y-1 shadow-xl shadow-indigo-500/10 flex items-center gap-2"
          >
            Start Quizzing Now <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 bg-slate-900/50 text-white text-lg font-bold rounded-xl border border-white/10 hover:bg-slate-800 transition-all backdrop-blur-sm">
            View Demo
          </button>
        </div>

        {/* Hero Visual Placeholder */}
        <div className="mt-20 w-full max-w-4xl bg-slate-900 rounded-xl border border-slate-800 shadow-2xl p-2 md:p-4 opacity-90 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-slate-950 rounded-lg overflow-hidden aspect-[16/9] relative group">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
             {/* Abstract UI Representation */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 flex gap-4">
                <div className="flex-1 bg-slate-800/50 rounded-lg animate-pulse"></div>
                <div className="flex-[2] flex flex-col gap-4">
                   <div className="h-8 bg-slate-800/50 rounded w-2/3"></div>
                   <div className="h-4 bg-slate-800/30 rounded w-full"></div>
                   <div className="h-4 bg-slate-800/30 rounded w-full"></div>
                   <div className="h-32 bg-slate-800/20 rounded w-full mt-auto"></div>
                </div>
             </div>
             <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                <div className="text-left">
                   <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">Live Preview</div>
                   <div className="text-white font-bold text-lg">Solar System Exploration</div>
                </div>
                <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-md">8/10 Score</div>
             </div>
          </div>
        </div>
      </header>

      {/* Content / Features */}
      <section className="relative z-10 py-24 bg-slate-900/50 border-t border-white/5 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Why choose Quizly?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">We combine advanced AI with proven learning techniques to create the ultimate study companion.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all group">
              <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">AI-Powered Generation</h3>
              <p className="text-slate-400 leading-relaxed">
                Simply upload a PDF or type a topic. Our Gemini engine analyzes the content and creates relevant, challenging questions instantly.
              </p>
            </div>

            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-all group">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Instant Feedback</h3>
              <p className="text-slate-400 leading-relaxed">
                Get immediate explanations for every answer. Understand the "why" behind the "what" to reinforce your learning.
              </p>
            </div>

            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Gamified Learning</h3>
              <p className="text-slate-400 leading-relaxed">
                Track your scores, beat the timer, and compete with yourself. Learning doesn't have to be boring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 bg-slate-950">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-indigo-500" />
             <span className="font-bold font-display text-lg">Quizly</span>
          </div>
          
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="text-slate-600 text-sm">
            © 2024 Quizly Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};