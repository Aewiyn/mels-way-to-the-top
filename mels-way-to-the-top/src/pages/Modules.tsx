import { Module } from '../data/modules';
import ModuleCard from '../components/Modules/ModuleCard';
import { useState } from 'react';
import { modules as defaultModules } from '../data/modules';
import { doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';

const getSemesterInfo = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 10 && month <= 12) {
    return `Fall ${year}`;
  } else if (month >= 1 && month <= 6) {
    return `Spring ${year}`;
  }
  return `Other`;
};

export default function Modules({ modules }: { modules: Module[] }) {
    const [statusFilter, setStatusFilter] = useState('All');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [levelFilter, setLevelFilter] = useState('All');

    const filteredModules = modules.filter(module => {
        const statusMatch = statusFilter === 'All' || module.status === statusFilter;
        const difficultyMatch = difficultyFilter === 'All' || module.difficulty === difficultyFilter;
        const levelMatch = levelFilter === 'All' || module.level.toString() === levelFilter;
        return statusMatch && difficultyMatch && levelMatch;
    });

    const modulesWithDates = filteredModules
        .filter(m => m.finalDate)
        .sort((a, b) => new Date(a.finalDate!).getTime() - new Date(b.finalDate!).getTime());

    const groupedBySemester = modulesWithDates.reduce((acc, module) => {
        const semester = getSemesterInfo(module.finalDate!);
        if (!acc[semester]) {
            acc[semester] = [];
        }
        acc[semester].push(module);
        return acc;
    }, {} as Record<string, Module[]>);

    const modulesWithoutDates = filteredModules.filter(m => !m.finalDate);

    return (
        <div className="bg-offwhite dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">My <span className="text-lavender">Modules</span></h1>

                <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mr-4">Filters:</h3>
                    <div>
                        <label htmlFor="status-filter" className="sr-only">Status</label>
                        <select 
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="difficulty-filter" className="sr-only">Difficulty</label>
                        <select 
                            id="difficulty-filter"
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="level-filter" className="sr-only">Level</label>
                        <select 
                            id="level-filter"
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="All">All Levels</option>
                            <option value="4">Level 4</option>
                            <option value="5">Level 5</option>
                            <option value="6">Level 6</option>
                        </select>
                    </div>
                </div>

                {filteredModules.length > 0 ? (
                    <div className="space-y-12">
                        {Object.keys(groupedBySemester).map(semester => (
                            <div key={semester}>
                                <h2 className="text-2xl font-semibold text-gray-700 dark:text-lavender mb-4 border-b pb-2">{semester}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {groupedBySemester[semester].map(module => (
                                        <ModuleCard module={module} key={module.id} />
                                    ))}
                                </div>
                            </div>
                        ))}

                        {modulesWithoutDates.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-700 dark:text-lavender mb-4 border-b pb-2">Unscheduled</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {modulesWithoutDates.map(module => (
                                        <ModuleCard module={module} key={module.id} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No modules match your criteria</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters to see more modules.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 