import { Link } from 'react-router-dom';
import { Module, ModuleStatus } from '../../data/modules';

const difficultyColor: Record<Module['difficulty'], string> = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-red-100 text-red-800',
  Custom: 'bg-purple-100 text-purple-800',
};

const statusColor: Record<ModuleStatus, string> = {
  'Upcoming': 'bg-gray-200 text-gray-800',
  'In Progress': 'bg-blue-200 text-blue-800',
  'Completed': 'bg-green-200 text-green-800',
};

const formatMonthYear = (dateString?: string): string => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  const formatted = date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  return formatted;
};

export default function ModuleCard({ module }: { module: Module }) {
  const nameParts = module.name.split(' – ');
  const idPart = nameParts[0];
  const titlePart = nameParts.slice(1).join(' – ');

  return (
    <Link to={`/modules/${module.id}`} className="block hover:shadow-lg transition-shadow duration-200 rounded-xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-primary dark:text-white pr-4 flex-1">
            <span className="text-lavender">{idPart}</span>
            {titlePart && ` – ${titlePart}`}
          </h3>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${difficultyColor[module.difficulty]}`}>
              {module.difficulty}
            </span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusColor[module.status]}`}>
              {module.status}
            </span>
          </div>
        </div>
        <div>
          <p><strong>Level:</strong> {module.level}</p>
          <p><strong>Est. time:</strong> {module.estimatedTime} / week</p>
          {module.finalDate && <p className="text-sm"><strong>Final:</strong> {formatMonthYear(module.finalDate)}</p>}
        </div>
      </div>
    </Link>
  );
} 