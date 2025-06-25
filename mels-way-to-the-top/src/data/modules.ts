export type ModuleStatus = 'Upcoming' | 'In Progress' | 'Completed';

export interface FileInfo {
  name: string;
  url: string;
  path: string;
}

export interface LinkInfo {
  title: string;
  url: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface Module {
  id: string;
  name: string;
  level: number;
  midterm: string;
  final: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Custom';
  finalDate?: string;
  estimatedTime: string;
  status: ModuleStatus;
  files?: FileInfo[];
  links?: LinkInfo[];
}

export const modules: Module[] = [
  { id: "CM1005", name: "CM1005 – Introduction to Programming I", level: 4, midterm: "Project (50%)", final: "Project (50%)", difficulty: "Easy", estimatedTime: "4–6h", status: 'Upcoming', finalDate: '2026-01' },
  { id: "CM1010", name: "CM1010 – Introduction to Programming II", level: 4, midterm: "Report (30%)", final: "Project (70%)", difficulty: "Medium", estimatedTime: "6–8h", status: 'Upcoming', finalDate: '2026-06' },
  { id: "CM1015", name: "CM1015 – Computational Mathematics", level: 4, midterm: "Written Exam (50%)", final: "Written Exam (50%)", difficulty: "Hard", estimatedTime: "6–8h", status: 'Upcoming', finalDate: '2026-06' },
  { id: "CM1020", name: "CM1020 – Discrete Mathematics", level: 4, midterm: "Written Exam (50%)", final: "Written Exam (50%)", difficulty: "Hard", estimatedTime: "6–8h", status: 'Upcoming', finalDate: '2026-06' },
  { id: "CM1025", name: "CM1025 – Fundamentals of Computer Science", level: 4, midterm: "Written Exam (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6h", status: 'Upcoming', finalDate: '2026-01' },
  { id: "CM1030", name: "CM1030 – How Computers Work", level: 4, midterm: "RPL exemptable", final: "RPL exemptable", difficulty: "Easy", estimatedTime: "2–4h", status: 'Upcoming' },
  { id: "CM1035", name: "CM1035 – Algorithms and Data Structures I", level: 4, midterm: "Written Exam (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6–8h", status: 'Upcoming', finalDate: '2026-01' },
  { id: "CM1040", name: "CM1040 – Web Development", level: 4, midterm: "Project (30%)", final: "Project (70%)", difficulty: "Medium", estimatedTime: "8h+", status: 'Upcoming', finalDate: '2026-06' },
  { id: "CM2005", name: "CM2005 – Object-Oriented Programming", level: 5, midterm: "Project (50%)", final: "Project (50%)", difficulty: "Hard", estimatedTime: "8h", status: 'Upcoming', finalDate: '2027-01' },
  { id: "CM2010", name: "CM2010 – Software Design and Development", level: 5, midterm: "Written Exam (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6h", status: 'Upcoming', finalDate: '2027-06' },
  { id: "CM2015", name: "CM2015 – Programming with Data", level: 5, midterm: "Project (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6–8h", status: 'Upcoming', finalDate: '2027-06' },
  { id: "CM2025", name: "CM2025 – Computer Security", level: 5, midterm: "Written Exam (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6h", status: 'Upcoming', finalDate: '2027-01' },
  { id: "CM2030", name: "CM2030 – Graphics Programming", level: 5, midterm: "Project (50%)", final: "Project (50%)", difficulty: "Easy", estimatedTime: "4h", status: 'Upcoming', finalDate: '2027-01' },
  { id: "CM2035", name: "CM2035 – Algorithms and Data Structures II", level: 5, midterm: "Written Exam (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6h", status: 'Upcoming', finalDate: '2027-06' },
  { id: "CM2040", name: "CM2040 – Databases, Networks and the Web", level: 5, midterm: "Project (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6h", status: 'Upcoming', finalDate: '2027-01' },
  { id: "CM2045", name: "CM2045 – Professional Practice for Computer Scientists", level: 5, midterm: "Project (50%)", final: "Written Exam (50%)", difficulty: "Hard", estimatedTime: "6–8h", status: 'Upcoming' },
  { id: "CM3005", name: "CM3005 – Data Science", level: 6, midterm: "Project (50%)", final: "Written Exam (50%)", difficulty: "Easy", estimatedTime: "6h", status: 'Upcoming', finalDate: '2028-06' },
  { id: "CM3010", name: "CM3010 – Databases and Advanced Data Techniques", level: 6, midterm: "Project (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6–8h", status: 'Upcoming', finalDate: '2028-01' },
  { id: "CM3015", name: "CM3015 – Machine Learning and Neural Networks", level: 6, midterm: "Project (50%)", final: "Project (50%)", difficulty: "Medium", estimatedTime: "6h", status: 'Upcoming', finalDate: '2028-01' },
  { id: "CM3020", name: "CM3020 – Artificial Intelligence", level: 6, midterm: "Written Exam (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6h", status: 'Upcoming', finalDate: '2028-06' },
  { id: "CM3060", name: "CM3060 – Natural Language Processing", level: 6, midterm: "Project (50%)", final: "Written Exam (50%)", difficulty: "Medium", estimatedTime: "6–8h", status: 'Upcoming', finalDate: '2028-06' },
  { id: "CM3065", name: "CM3065 – Intelligent Signal Processing", level: 6, midterm: "Project (50%)", final: "Project (50%)", difficulty: "Hard", estimatedTime: "6–8h", status: 'Upcoming', finalDate: '2028-01' },
  { id: "CM3070", name: "CM3070 – Final Project", level: 6, midterm: "Report", final: "Project", difficulty: "Custom", estimatedTime: "Variable", status: 'Upcoming', finalDate: '2028-06' },
]; 