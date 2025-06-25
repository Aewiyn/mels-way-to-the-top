import { Module } from "../../data/modules";

const ProgressWidget = ({ modules }: { modules: Module[] }) => {
  const completed = modules.filter(m => m.status === 'Completed').length;
  const inProgress = modules.filter(m => m.status === 'In Progress').length;
  const upcoming = modules.filter(m => m.status === 'Upcoming').length;
  const total = modules.length;

  const completedPercentage = total > 0 ? (completed / total) * 100 : 0;
  const inProgressPercentage = total > 0 ? (inProgress / total) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4 flex">
          <div 
            className="h-2.5 bg-lavender" 
            style={{ width: `${completedPercentage}%` }}
            title={`Completed: ${completed}`}
          ></div>
          <div 
            className="h-2.5 bg-sky-blue" 
            style={{ width: `${inProgressPercentage}%` }}
            title={`In Progress: ${inProgress}`}
          ></div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-lavender"></span>
          <span>{completed} completed</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-blue"></span>
          <span>{inProgress} in progress</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-300 border dark:border-gray-600"></span>
          <span>{upcoming} upcoming</span>
        </span>
      </div>
    </div>
  );
};

export default ProgressWidget; 