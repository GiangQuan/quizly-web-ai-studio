import React, { useState, useRef } from 'react';
import { Quiz } from './types';
import { QuizCreator } from './components/QuizCreator';
import { QuizPlayer } from './components/QuizPlayer';
import { LandingPage } from './components/LandingPage'; // Import Landing Page
import { HashRouter, Routes, Route } from 'react-router-dom';
import { 
  Plus, Play, Clock, Sparkles, BookOpen, Pencil, Search, 
  Download, Upload, Code, Globe, FlaskConical, Film, Music, 
  Palette, Calculator, ScrollText, Rocket, BrainCircuit, Zap,
  Settings, LogOut, User
} from 'lucide-react';
import { exportQuizToExcel, importQuizFromExcel } from './services/excel';
import { v4 as uuidv4 } from 'uuid';
import { sounds } from './services/sound';

// Enhanced Mock Initial Data
const INITIAL_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Space Exploration',
    description: 'Test your knowledge about the universe, planets, and space travel.',
    topic: 'Science',
    createdAt: Date.now(),
    questions: [
      {
        id: 'q1',
        text: 'Which planet is known as the Red Planet?',
        options: [
          { id: 'o1', text: 'Venus', isCorrect: false },
          { id: 'o2', text: 'Mars', isCorrect: true },
          { id: 'o3', text: 'Jupiter', isCorrect: false },
        ],
        explanation: 'Mars is called the Red Planet because of the iron oxide prevalent on its surface.'
      },
      {
         id: 'q2',
         text: 'Who was the first human to travel into space?',
         options: [
           { id: 'o1', text: 'Neil Armstrong', isCorrect: false },
           { id: 'o2', text: 'Yuri Gagarin', isCorrect: true },
           { id: 'o3', text: 'Buzz Aldrin', isCorrect: false }
         ],
         explanation: 'Yuri Gagarin was a Soviet pilot and cosmonaut who became the first human to journey into outer space.'
      },
      {
        id: 'q3',
        text: 'What is the name of the galaxy that contains our Solar System?',
        options: [
          { id: 'o1', text: 'Andromeda', isCorrect: false },
          { id: 'o2', text: 'Triangulum', isCorrect: false },
          { id: 'o3', text: 'Milky Way', isCorrect: true }
        ],
        explanation: 'The Milky Way is the galaxy that contains our Solar System.'
      },
      {
        id: 'q4',
        text: 'Which planet has the most moons?',
        options: [
          { id: 'o1', text: 'Saturn', isCorrect: true },
          { id: 'o2', text: 'Jupiter', isCorrect: false },
          { id: 'o3', text: 'Uranus', isCorrect: false }
        ],
        explanation: 'Saturn currently holds the record for the most confirmed moons.'
      },
      {
        id: 'q5',
        text: 'What is the largest planet in our solar system?',
        options: [
          { id: 'o5_1', text: 'Earth', isCorrect: false },
          { id: 'o5_2', text: 'Jupiter', isCorrect: true },
          { id: 'o5_3', text: 'Neptune', isCorrect: false }
        ],
        explanation: 'Jupiter is more than twice as massive as all the other planets combined.'
      },
      {
        id: 'q6',
        text: 'Which planet has a day longer than its year?',
        options: [
          { id: 'o6_1', text: 'Mercury', isCorrect: false },
          { id: 'o6_2', text: 'Venus', isCorrect: true },
          { id: 'o6_3', text: 'Mars', isCorrect: false }
        ],
        explanation: 'Venus rotates very slowly on its axis, taking 243 Earth days to complete one rotation, while its orbit takes 225 days.'
      },
      {
        id: 'q7',
        text: 'What is the closest star to Earth?',
        options: [
          { id: 'o7_1', text: 'Proxima Centauri', isCorrect: false },
          { id: 'o7_2', text: 'The Sun', isCorrect: true },
          { id: 'o7_3', text: 'Sirius', isCorrect: false }
        ],
        explanation: 'The Sun is the star at the center of our Solar System.'
      },
      {
        id: 'q8',
        text: 'Who was the first woman in space?',
        options: [
          { id: 'o8_1', text: 'Sally Ride', isCorrect: false },
          { id: 'o8_2', text: 'Valentina Tereshkova', isCorrect: true },
          { id: 'o8_3', text: 'Mae Jemison', isCorrect: false }
        ],
        explanation: 'Valentina Tereshkova orbited Earth in 1963.'
      },
      {
        id: 'q9',
        text: 'What force keeps planets in orbit around the Sun?',
        options: [
          { id: 'o9_1', text: 'Magnetism', isCorrect: false },
          { id: 'o9_2', text: 'Gravity', isCorrect: true },
          { id: 'o9_3', text: 'Inertia', isCorrect: false }
        ],
        explanation: 'Gravity is the force of attraction that keeps planets in their orbits.'
      },
      {
        id: 'q10',
        text: 'What is the center of a black hole called?',
        options: [
          { id: 'o10_1', text: 'Event Horizon', isCorrect: false },
          { id: 'o10_2', text: 'Singularity', isCorrect: true },
          { id: 'o10_3', text: 'Nebula', isCorrect: false }
        ],
        explanation: 'The singularity is the point of infinite density at the center of a black hole.'
      }
    ]
  },
  {
    id: '2',
    title: 'World History 101',
    description: 'A journey through major events that shaped our world civilization.',
    topic: 'History',
    createdAt: Date.now() - 100000,
    questions: [
      {
        id: 'hq1',
        text: 'Who painted the Mona Lisa?',
        options: [
          { id: 'ho1', text: 'Vincent van Gogh', isCorrect: false },
          { id: 'ho2', text: 'Pablo Picasso', isCorrect: false },
          { id: 'ho3', text: 'Leonardo da Vinci', isCorrect: true },
          { id: 'ho4', text: 'Michelangelo', isCorrect: false },
        ],
        explanation: 'The Mona Lisa was painted by Italian artist Leonardo da Vinci in the early 16th century.'
      },
      {
        id: 'hq2',
        text: 'In which year did World War II end?',
        options: [
          { id: 'ho5', text: '1945', isCorrect: true },
          { id: 'ho6', text: '1939', isCorrect: false },
          { id: 'ho7', text: '1918', isCorrect: false },
        ],
        explanation: 'World War II ended in 1945 with the surrender of Germany and Japan.'
      },
      {
        id: 'hq3',
        text: 'Who was the first Emperor of Rome?',
        options: [
          { id: 'ho8', text: 'Julius Caesar', isCorrect: false },
          { id: 'ho9', text: 'Augustus', isCorrect: true },
          { id: 'ho10', text: 'Nero', isCorrect: false }
        ],
        explanation: 'Augustus (Octavian) became the first Emperor of Rome in 27 BC.'
      },
      {
        id: 'hq4',
        text: 'What ancient civilization built the pyramids?',
        options: [
          { id: 'ho11', text: 'The Mayans', isCorrect: false },
          { id: 'ho12', text: 'The Egyptians', isCorrect: true },
          { id: 'ho13', text: 'The Romans', isCorrect: false }
        ],
        explanation: 'The ancient Egyptians built the pyramids as tombs for their pharaohs.'
      },
      {
        id: 'hq5',
        text: 'Who was the first President of the United States?',
        options: [
          { id: 'ho14', text: 'Thomas Jefferson', isCorrect: false },
          { id: 'ho15', text: 'George Washington', isCorrect: true },
          { id: 'ho16', text: 'Abraham Lincoln', isCorrect: false }
        ],
        explanation: 'George Washington served as the first president from 1789 to 1797.'
      },
      {
        id: 'hq6',
        text: 'Which ship sank in 1912?',
        options: [
          { id: 'ho17', text: 'Titanic', isCorrect: true },
          { id: 'ho18', text: 'Lusitania', isCorrect: false },
          { id: 'ho19', text: 'Olympic', isCorrect: false }
        ],
        explanation: 'The RMS Titanic sank in the North Atlantic Ocean in 1912.'
      },
      {
        id: 'hq7',
        text: 'Who is credited with discovering penicillin?',
        options: [
          { id: 'ho20', text: 'Marie Curie', isCorrect: false },
          { id: 'ho21', text: 'Alexander Fleming', isCorrect: true },
          { id: 'ho22', text: 'Louis Pasteur', isCorrect: false }
        ],
        explanation: 'Alexander Fleming discovered penicillin in 1928.'
      },
      {
        id: 'hq8',
        text: 'Which wall fell in 1989?',
        options: [
          { id: 'ho23', text: 'The Great Wall', isCorrect: false },
          { id: 'ho24', text: 'The Berlin Wall', isCorrect: true },
          { id: 'ho25', text: 'Hadrian\'s Wall', isCorrect: false }
        ],
        explanation: 'The fall of the Berlin Wall symbolized the end of the Cold War.'
      },
      {
        id: 'hq9',
        text: 'Who was known as the "Maid of Orléans"?',
        options: [
          { id: 'ho26', text: 'Catherine the Great', isCorrect: false },
          { id: 'ho27', text: 'Joan of Arc', isCorrect: true },
          { id: 'ho28', text: 'Queen Victoria', isCorrect: false }
        ],
        explanation: 'Joan of Arc led the French army to victory at Orléans.'
      },
      {
        id: 'hq10',
        text: 'Which empire was located in modern-day Peru?',
        options: [
          { id: 'ho29', text: 'Aztec', isCorrect: false },
          { id: 'ho30', text: 'Inca', isCorrect: true },
          { id: 'ho31', text: 'Maya', isCorrect: false }
        ],
        explanation: 'The Inca Empire was the largest empire in pre-Columbian America, centered in modern-day Peru.'
      }
    ]
  },
  {
    id: '3',
    title: 'JavaScript Mastery',
    description: 'Challenge yourself with tricky JavaScript concepts and syntax.',
    topic: 'Coding',
    createdAt: Date.now() - 200000,
    questions: [
      {
        id: 'jq1',
        text: 'What is the output of "2" + 2 in JavaScript?',
        options: [
          { id: 'jo1', text: '4', isCorrect: false },
          { id: 'jo2', text: '"22"', isCorrect: true },
          { id: 'jo3', text: 'NaN', isCorrect: false },
        ],
        explanation: 'The + operator concatenates strings. Since one operand is a string, the other is converted to a string.'
      },
      {
        id: 'jq2',
        text: 'Which keyword is used to declare a constant variable?',
        options: [
          { id: 'jo4', text: 'var', isCorrect: false },
          { id: 'jo5', text: 'let', isCorrect: false },
          { id: 'jo6', text: 'const', isCorrect: true },
        ],
        explanation: 'const is used to declare variables that cannot be reassigned.'
      },
      {
        id: 'jq3',
        text: 'What does JSON stand for?',
        options: [
          { id: 'jo7', text: 'Java Standard Object Notation', isCorrect: false },
          { id: 'jo8', text: 'JavaScript Object Notation', isCorrect: true },
          { id: 'jo9', text: 'JavaScript Object Network', isCorrect: false }
        ],
        explanation: 'JSON stands for JavaScript Object Notation.'
      },
      {
        id: 'jq4',
        text: 'What is the result of typeof null?',
        options: [
          { id: 'jo10', text: '"null"', isCorrect: false },
          { id: 'jo11', text: '"object"', isCorrect: true },
          { id: 'jo12', text: '"undefined"', isCorrect: false }
        ],
        explanation: 'In JavaScript, typeof null returns "object". This is a known historical bug.'
      },
      {
        id: 'jq5',
        text: 'Which method is used to add elements to the end of an array?',
        options: [
          { id: 'jo13', text: 'pop()', isCorrect: false },
          { id: 'jo14', text: 'push()', isCorrect: true },
          { id: 'jo15', text: 'shift()', isCorrect: false }
        ],
        explanation: 'The push() method adds one or more elements to the end of an array.'
      },
      {
        id: 'jq6',
        text: 'Which operator checks for both value and type equality?',
        options: [
          { id: 'jo16', text: '==', isCorrect: false },
          { id: 'jo17', text: '===', isCorrect: true },
          { id: 'jo18', text: '=', isCorrect: false }
        ],
        explanation: 'The strict equality operator (===) checks whether its two operands are equal, returning a Boolean result.'
      },
      {
        id: 'jq7',
        text: 'What is a closure?',
        options: [
          { id: 'jo19', text: 'A function with access to its outer scope', isCorrect: true },
          { id: 'jo20', text: 'A way to close the browser window', isCorrect: false },
          { id: 'jo21', text: 'A method to end a loop', isCorrect: false }
        ],
        explanation: 'A closure is the combination of a function bundled together with references to its surrounding state.'
      },
      {
        id: 'jq8',
        text: 'Which function is used to parse a string to an integer?',
        options: [
          { id: 'jo22', text: 'parseInt()', isCorrect: true },
          { id: 'jo23', text: 'toInteger()', isCorrect: false },
          { id: 'jo24', text: 'parseNumber()', isCorrect: false }
        ],
        explanation: 'The parseInt() function parses a string argument and returns an integer of the specified radix.'
      },
      {
        id: 'jq9',
        text: 'What does DOM stand for?',
        options: [
          { id: 'jo25', text: 'Data Object Model', isCorrect: false },
          { id: 'jo26', text: 'Document Object Model', isCorrect: true },
          { id: 'jo27', text: 'Digital Object Module', isCorrect: false }
        ],
        explanation: 'The DOM is a programming interface for web documents.'
      },
      {
        id: 'jq10',
        text: 'Which syntax is correct for a single-line comment?',
        options: [
          { id: 'jo28', text: '/* comment */', isCorrect: false },
          { id: 'jo29', text: '// comment', isCorrect: true },
          { id: 'jo30', text: '<!-- comment -->', isCorrect: false }
        ],
        explanation: '// is used for single-line comments in JavaScript.'
      }
    ]
  },
  {
    id: '4',
    title: 'Movie Trivia',
    description: 'Guess the movie from quotes, actors, and plot lines.',
    topic: 'Movies',
    createdAt: Date.now() - 300000,
    questions: [
      {
        id: 'mq1',
        text: 'Which movie features the character "The Dude"?',
        options: [
          { id: 'mo1', text: 'The Big Lebowski', isCorrect: true },
          { id: 'mo2', text: 'Pulp Fiction', isCorrect: false },
          { id: 'mo3', text: 'Fargo', isCorrect: false },
        ],
        explanation: 'Jeff Bridges plays "The Dude" in the Coen Brothers cult classic The Big Lebowski.'
      },
      {
        id: 'mq2',
        text: 'Who directed "Inception"?',
        options: [
          { id: 'mo4', text: 'Steven Spielberg', isCorrect: false },
          { id: 'mo5', text: 'Christopher Nolan', isCorrect: true },
          { id: 'mo6', text: 'Quentin Tarantino', isCorrect: false }
        ],
        explanation: 'Christopher Nolan directed Inception, released in 2010.'
      },
      {
        id: 'mq3',
        text: 'Which movie is the highest-grossing film of all time (as of 2023)?',
        options: [
          { id: 'mo7', text: 'Avengers: Endgame', isCorrect: false },
          { id: 'mo8', text: 'Avatar', isCorrect: true },
          { id: 'mo9', text: 'Titanic', isCorrect: false }
        ],
        explanation: 'Avatar holds the record for the highest-grossing film of all time.'
      },
      {
        id: 'mq4',
        text: 'Which franchise features the quote "May the Force be with you"?',
        options: [
          { id: 'mo10', text: 'Star Trek', isCorrect: false },
          { id: 'mo11', text: 'Star Wars', isCorrect: true },
          { id: 'mo12', text: 'Battlestar Galactica', isCorrect: false }
        ],
        explanation: 'This is the iconic phrase from the Star Wars universe.'
      },
      {
        id: 'mq5',
        text: 'Who played Jack Dawson in "Titanic"?',
        options: [
          { id: 'mo13', text: 'Brad Pitt', isCorrect: false },
          { id: 'mo14', text: 'Leonardo DiCaprio', isCorrect: true },
          { id: 'mo15', text: 'Johnny Depp', isCorrect: false }
        ],
        explanation: 'Leonardo DiCaprio starred as Jack Dawson.'
      },
      {
        id: 'mq6',
        text: 'What was the first feature-length animated movie?',
        options: [
          { id: 'mo16', text: 'Fantasia', isCorrect: false },
          { id: 'mo17', text: 'Snow White and the Seven Dwarfs', isCorrect: true },
          { id: 'mo18', text: 'Bambi', isCorrect: false }
        ],
        explanation: 'Released in 1937, Snow White was the first full-length cel-animated feature.'
      },
      {
        id: 'mq7',
        text: 'Which movie features the line "Here\'s looking at you, kid"?',
        options: [
          { id: 'mo19', text: 'Gone with the Wind', isCorrect: false },
          { id: 'mo20', text: 'Casablanca', isCorrect: true },
          { id: 'mo21', text: 'Citizen Kane', isCorrect: false }
        ],
        explanation: 'This line is spoken by Humphrey Bogart in Casablanca.'
      },
      {
        id: 'mq8',
        text: 'Who voices Woody in "Toy Story"?',
        options: [
          { id: 'mo22', text: 'Tim Allen', isCorrect: false },
          { id: 'mo23', text: 'Tom Hanks', isCorrect: true },
          { id: 'mo24', text: 'Billy Crystal', isCorrect: false }
        ],
        explanation: 'Tom Hanks provides the voice for the cowboy doll Woody.'
      },
      {
        id: 'mq9',
        text: 'What is the name of the hobbit played by Elijah Wood?',
        options: [
          { id: 'mo25', text: 'Samwise Gamgee', isCorrect: false },
          { id: 'mo26', text: 'Frodo Baggins', isCorrect: true },
          { id: 'mo27', text: 'Bilbo Baggins', isCorrect: false }
        ],
        explanation: 'Elijah Wood portrays Frodo Baggins in The Lord of the Rings.'
      },
      {
        id: 'mq10',
        text: 'Which family is at the center of "The Godfather"?',
        options: [
          { id: 'mo28', text: 'The Sopranos', isCorrect: false },
          { id: 'mo29', text: 'The Corleones', isCorrect: true },
          { id: 'mo30', text: 'The Barzinis', isCorrect: false }
        ],
        explanation: 'The Corleone crime family is central to The Godfather saga.'
      }
    ]
  }
];

const getTopicIcon = (topic: string) => {
  const t = topic.toLowerCase();
  if (t.includes('science') || t.includes('space') || t.includes('physics')) return <Rocket className="w-5 h-5" />;
  if (t.includes('history') || t.includes('past')) return <ScrollText className="w-5 h-5" />;
  if (t.includes('code') || t.includes('tech') || t.includes('program')) return <Code className="w-5 h-5" />;
  if (t.includes('movie') || t.includes('film') || t.includes('cinema')) return <Film className="w-5 h-5" />;
  if (t.includes('music') || t.includes('song')) return <Music className="w-5 h-5" />;
  if (t.includes('art') || t.includes('design')) return <Palette className="w-5 h-5" />;
  if (t.includes('math')) return <Calculator className="w-5 h-5" />;
  if (t.includes('geo') || t.includes('earth')) return <Globe className="w-5 h-5" />;
  if (t.includes('chem')) return <FlaskConical className="w-5 h-5" />;
  return <BrainCircuit className="w-5 h-5" />;
};

const Dashboard: React.FC<{ 
  quizzes: Quiz[], 
  onCreateClick: () => void,
  onQuizSelect: (quiz: Quiz) => void,
  onEditQuiz: (quiz: Quiz) => void,
  onImportQuiz: (file: File) => void
}> = ({ quizzes, onCreateClick, onQuizSelect, onEditQuiz, onImportQuiz }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportQuiz(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProfileToggle = () => {
    sounds.playClick();
    setIsProfileOpen(!isProfileOpen);
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto min-h-screen animate-fade-in pb-20">
      
      {/* Row 1: Logo & Profile */}
      <div className="flex flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight flex items-center gap-3">
             <span className="font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-300 py-2 drop-shadow-sm">
               Quizly
             </span>
          </h1>
          <p className="text-slate-400 mt-2 text-base md:text-lg font-light tracking-wide max-w-xl hidden sm:block">
            Limitless learning. Powered by intelligence.
          </p>
        </div>

        {/* Profile Dropdown */}
        <div className="relative z-50 flex-shrink-0">
          <button 
            onClick={handleProfileToggle}
            className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 hover:border-indigo-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 overflow-hidden shadow-lg"
          >
             <img src="https://api.dicebear.com/9.x/micah/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
          </button>
          
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-slide-up origin-top-right ring-1 ring-white/5 z-50">
                  <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/50">
                    <p className="text-sm text-white font-bold">Felix The Cat</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">user@quizly.app</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3 rounded-lg group">
                      <Settings className="w-4 h-4 text-slate-500 group-hover:text-blue-400" /> Settings
                    </button>
                    <button className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3 rounded-lg group">
                      <LogOut className="w-4 h-4 group-hover:text-red-400" /> Sign Out
                    </button>
                  </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 2: Search & Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-10 justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all shadow-sm"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
           <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".xlsx, .xls" 
              onChange={handleFileChange}
            />
           <button
            onClick={() => { sounds.playClick(); fileInputRef.current?.click(); }}
            className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-5 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 border border-slate-700 hover:border-slate-600 shadow-sm text-sm whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); onCreateClick(); }}
            className="flex-1 md:flex-none group relative bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 overflow-hidden border border-slate-700 hover:border-slate-600 text-sm whitespace-nowrap"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Quiz
            </span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {/* Create with AI Card */}
        <div 
           onClick={() => { sounds.playClick(); onCreateClick(); }}
           className="bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-indigo-500/20 hover:border-indigo-400/50 cursor-pointer transition-all duration-300 flex flex-col justify-center items-center text-center group relative overflow-hidden shadow-lg hover:shadow-indigo-900/20 min-h-[180px] lg:min-h-[240px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 z-10 group-hover:bg-indigo-500/20 group-hover:border-indigo-400/30 shadow-inner">
             <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-indigo-400" />
          </div>
          <h3 className="text-lg lg:text-xl font-bold mb-2 text-white relative z-10 group-hover:text-indigo-200 transition-colors font-display">AI Generator</h3>
          <p className="text-slate-400 text-xs lg:text-sm relative z-10 px-2 leading-relaxed">Instantly generate challenging quizzes from any topic using Gemini.</p>
        </div>

        {filteredQuizzes.map(quiz => (
          <div 
            key={quiz.id} 
            className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 lg:p-5 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 group hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 relative flex flex-col min-h-[180px] lg:min-h-[240px]"
          >
            
            <div className="flex justify-between items-start mb-3 lg:mb-4 relative z-10">
              <div className="p-2 lg:p-2.5 bg-slate-800/80 rounded-xl text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-900/20 transition-colors duration-300 border border-white/5">
                {getTopicIcon(quiz.topic)}
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); exportQuizToExcel(quiz); }}
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-indigo-300 transition-colors"
                  title="Export to Excel"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEditQuiz(quiz); }}
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-white transition-colors"
                  title="Edit Quiz"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-auto relative z-10 cursor-pointer" onClick={() => { sounds.playClick(); onQuizSelect(quiz); }}>
               <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 border border-slate-700/50 px-2 py-0.5 rounded-md bg-slate-800/30">
                 {quiz.topic}
               </span>
               <h3 className="text-base lg:text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors leading-tight font-display">
                 {quiz.title}
               </h3>
               <p className="text-slate-400 text-xs line-clamp-3 font-medium leading-relaxed">
                 {quiz.description}
               </p>
            </div>
            
            <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-3 lg:pt-4 mt-3 lg:mt-4 relative z-10">
               <span className="text-slate-500 font-medium flex items-center gap-1.5">
                 <Clock className="w-3.5 h-3.5" /> {quiz.questions.length} Questions
               </span>
               <button 
                 onClick={() => { sounds.playClick(); onQuizSelect(quiz); }}
                 className="flex items-center text-indigo-400 font-bold text-xs hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 group-hover:bg-indigo-500/20"
               >
                 START <Play className="w-3 h-3 ml-1.5 fill-current" />
               </button>
            </div>
          </div>
        ))}

        {filteredQuizzes.length === 0 && searchTerm && (
           <div className="col-span-full py-12 text-center text-slate-500 italic">
             No quizzes found matching "{searchTerm}"
           </div>
        )}
      </div>
    </div>
  );
};

const DashboardContainer = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [view, setView] = useState<'dashboard' | 'create' | 'play'>('dashboard');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizToEdit, setQuizToEdit] = useState<Quiz | undefined>(undefined);

  const handleSaveQuiz = (savedQuiz: Quiz) => {
    if (quizToEdit) {
      // Update existing
      setQuizzes(quizzes.map(q => q.id === savedQuiz.id ? savedQuiz : q));
    } else {
      // Create new
      setQuizzes([savedQuiz, ...quizzes]);
    }
    setView('dashboard');
    setQuizToEdit(undefined);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setQuizToEdit(quiz);
    setView('create');
  };

  const handleCreateClick = () => {
    setQuizToEdit(undefined);
    setView('create');
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setView('play');
  };

  const handleImportQuiz = async (file: File) => {
    try {
      const partialQuiz = await importQuizFromExcel(file);
      const newQuiz: Quiz = {
        id: uuidv4(),
        title: partialQuiz.title || 'Imported Quiz',
        description: partialQuiz.description || '',
        topic: partialQuiz.topic || 'General',
        createdAt: Date.now(),
        questions: partialQuiz.questions || []
      };
      setQuizzes([newQuiz, ...quizzes]);
      alert(`Imported "${newQuiz.title}" successfully!`);
    } catch (error) {
      console.error(error);
      alert("Failed to import quiz. Please check the file format.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-100 overflow-x-hidden">
      {/* Noise and Gradient Overlays */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-50"></div>
      
      {/* RESTORED & ENHANCED GRADIENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Original Top Left */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
          
          {/* Original Top Right */}
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
          
          {/* New: Left Side Blob */}
          <div className="absolute top-[40%] left-[-15%] w-[35%] h-[50%] rounded-full bg-indigo-800/20 blur-[130px]" />
          
          {/* New: Right Side Blob */}
          <div className="absolute top-[40%] right-[-15%] w-[35%] h-[50%] rounded-full bg-purple-800/20 blur-[130px]" />

          {/* New: Bottom Center Blob */}
          <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-blue-900/20 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto w-full">
        {view === 'dashboard' && (
          <Dashboard 
            quizzes={quizzes} 
            onCreateClick={handleCreateClick} 
            onQuizSelect={handleQuizSelect} 
            onEditQuiz={handleEditQuiz}
            onImportQuiz={handleImportQuiz}
          />
        )}

        {view === 'create' && (
          <QuizCreator 
            onSave={handleSaveQuiz} 
            onCancel={() => {
              setView('dashboard');
              setQuizToEdit(undefined);
            }}
            initialQuiz={quizToEdit}
          />
        )}

        {view === 'play' && activeQuiz && (
          <QuizPlayer 
            quiz={activeQuiz} 
            onExit={() => {
              setActiveQuiz(null);
              setView('dashboard');
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
       <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardContainer />} />
       </Routes>
    </HashRouter>
  );
}