export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  imageUrl?: string;
  options: QuizOption[];
  explanation?: string;
}

export type TimerMode = 'per-question' | 'total-duration';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  topic: string;
  createdAt: number;
  questions: QuizQuestion[];
  timerMode?: TimerMode;
  timeLimit?: number; // seconds
}

export enum ImageSize {
  Size_1K = '1K',
  Size_2K = '2K',
  Size_4K = '4K'
}