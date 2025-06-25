import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Module } from '../data/modules';
import CalendarToolbar from '../components/layout/CalendarToolbar';
import { useNavigate } from 'react-router-dom';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface TimelineProps {
    modules: Module[];
}

const Timeline = ({ modules }: TimelineProps) => {
    const navigate = useNavigate();

    // 1. Group modules by the year in their finalDate
    const modulesByYear = modules
        .filter(module => module.finalDate)
        .reduce((acc, module) => {
            const year = module.finalDate!.split('-')[0];
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(module);
            return acc;
        }, {} as Record<string, Module[]>);

    // 2. Determine revision periods for each year
    const sortedYears = Object.keys(modulesByYear).sort();
    const revisionPeriods: Record<string, { start: Date, end: Date }> = {};
    sortedYears.forEach((yearStr, index) => {
        const year = parseInt(yearStr);
        const endDate = new Date(year, 0, 31); // Jan 31st
        let startDate;
        if (index === 0) {
            startDate = new Date(); // today
        } else {
            const previousYear = parseInt(sortedYears[index - 1]);
            startDate = new Date(previousYear, 1, 1); // Feb 1st of previous year
        }
        if (startDate <= endDate) {
            revisionPeriods[yearStr] = { start: startDate, end: endDate };
        }
    });

    // 3. Create one event PER MODULE using the revision periods
    const events: Event[] = modules
        .filter(module => module.finalDate)
        .map((module): Event | null => {
            const year = module.finalDate!.split('-')[0];
            const period = revisionPeriods[year];
            if (!period) return null;

            return {
                title: `Revision: ${module.name}`,
                start: period.start,
                end: period.end,
                allDay: true,
                resource: module, // Pass the whole module for navigation
            };
        })
        .filter((event): event is Event => event !== null);

    const handleSelectEvent = (event: Event) => {
        if (event.resource && event.resource.id) {
            navigate(`/modules/${event.resource.id}`);
        }
    };

  return (
    <div className="p-8 bg-offwhite dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">
            <span className="text-gray-800 dark:text-white">Course </span>
            <span className="text-lavender">Timeline</span>
        </h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-[80vh]">
          <Calendar<Event>
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            defaultView="week"
            components={{
              toolbar: CalendarToolbar,
            }}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline; 