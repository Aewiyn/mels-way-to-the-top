import { useState, useEffect, useRef } from 'react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(WORK_MINUTES);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer is done, switch mode
            setIsWorkTime(!isWorkTime);
            setMinutes(isWorkTime ? BREAK_MINUTES : WORK_MINUTES);
            setSeconds(0);
            setIsActive(false); // Stop the timer
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
        if(intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds, minutes, isWorkTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isWorkTime ? WORK_MINUTES : BREAK_MINUTES);
    setSeconds(0);
  };

  const setMode = (work: boolean) => {
    setIsWorkTime(work);
    setIsActive(false);
    setMinutes(work ? WORK_MINUTES : BREAK_MINUTES);
    setSeconds(0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-full flex flex-col justify-between">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">Pomodoro</h2>
      <div className="flex justify-center gap-2 mb-4">
        <button 
          onClick={() => setMode(true)} 
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isWorkTime ? 'bg-lavender text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}
        >
          Work
        </button>
        <button 
          onClick={() => setMode(false)} 
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!isWorkTime ? 'bg-lavender text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}
        >
          Break
        </button>
      </div>
      <div className="text-6xl font-mono font-bold text-gray-800 dark:text-white my-4 text-center">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="flex justify-center gap-4">
        <button onClick={toggleTimer} className="px-6 py-2 bg-lavender text-white rounded-lg hover:opacity-90 font-semibold">
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 font-semibold">
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;