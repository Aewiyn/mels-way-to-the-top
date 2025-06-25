const TodayTasks = () => {
  // Static data for now
  const tasks = [
    { id: 1, text: 'Review CM1015 notes', completed: true },
    { id: 2, text: 'Work on CM1005 project', completed: false },
    { id: 3, text: 'Read chapter 3 of "How Computers Work"', completed: false },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Today's Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <input type="checkbox" checked={task.completed} readOnly className="accent-primary" />
            <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodayTasks; 