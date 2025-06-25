import { ToolbarProps, View } from 'react-big-calendar';

const CalendarToolbar = (props: ToolbarProps) => {
  const { label, onNavigate, onView, view } = props;

  const goToBack = () => {
    onNavigate('PREV');
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToCurrent = () => {
    onNavigate('TODAY');
  };

  const handleViewChange = (newView: View) => {
    onView(newView);
  }

  const viewNamesGroup: { view: View, name: string }[] = [
    { view: 'month', name: 'Month' },
    { view: 'week', name: 'Week' },
    { view: 'day', name: 'Day' },
    { view: 'agenda', name: 'Agenda' },
  ];

  return (
    <div className="rbc-toolbar mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left side: Navigation */}
      <div className="flex items-center justify-start gap-2">
        <button
          type="button"
          onClick={goToCurrent}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Today
        </button>
        <button
          type="button"
          onClick={goToBack}
          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          &lt;
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          &gt;
        </button>
      </div>

      {/* Center: Label */}
      <div className="text-lg font-bold text-gray-800 dark:text-white order-first sm:order-none">
        {label}
      </div>

      {/* Right side: Views */}
      <div className="flex items-center justify-end gap-2">
        {viewNamesGroup.map(item => (
          <button
            key={item.view}
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === item.view
                ? 'bg-lavender text-white shadow-sm'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleViewChange(item.view)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarToolbar; 