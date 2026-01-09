
export interface KidProfile {
  name: string;
  age: number;
  grade: string;
  interests: string[];
  strengths: string;
  struggles: string;
}

export interface WorksheetItem {
  id: string;
  question: string;
  instruction?: string;
  answerPlaceholder?: string;
}

export interface WorksheetSection {
  title: string;
  type: 'math' | 'reading' | 'writing' | 'puzzle' | 'drawing' | 'maze';
  items: WorksheetItem[];
  mazeConfig?: { width: number, height: number, seed: number };
}

export interface WorksheetData {
  id: string;
  timestamp: number;
  title: string;
  theme: string;
  sections: WorksheetSection[];
  funFact?: string;
  heroMessage: string;
  kidName: string;
}

export enum AppState {
  PROFILE = 'profile',
  CHATTING = 'chatting',
  GENERATING = 'generating',
  VIEWING = 'viewing',
  GALLERY = 'gallery'
}
