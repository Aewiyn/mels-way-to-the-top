import ProgressWidget from './ProgressWidget';
import PomodoroTimer from './PomodoroTimer';
import TodayTasks from './TodayTasks';
import { Module } from '../../data/modules';

export default function Dashboard({ modules }: { modules: Module[] }) {
  return (
    <div className="bg-offwhite dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Hello <span className="text-lavender">Mélissa,</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Ready to climb another step?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProgressWidget modules={modules} />
          <PomodoroTimer />
          <TodayTasks />
        </div>
      </div>
    </div>
  );
} 