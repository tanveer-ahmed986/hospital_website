/**
 * OPDSchedule Component
 *
 * Display doctor's OPD (Outpatient Department) schedule.
 */

import React from 'react';

export interface ScheduleItem {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export interface OPDScheduleProps {
  schedule: ScheduleItem[];
  className?: string;
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DAY_ABBREVIATIONS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Format time from 24-hour to 12-hour format
 */
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Group schedule items by day
 */
function groupScheduleByDay(schedule: ScheduleItem[]): Map<number, ScheduleItem[]> {
  const grouped = new Map<number, ScheduleItem[]>();

  for (const item of schedule) {
    const existing = grouped.get(item.dayOfWeek) || [];
    grouped.set(item.dayOfWeek, [...existing, item]);
  }

  // Sort each day's schedules by start time
  grouped.forEach((items, day) => {
    grouped.set(
      day,
      items.sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
  });

  return grouped;
}

export const OPDSchedule: React.FC<OPDScheduleProps> = ({
  schedule,
  className = '',
}) => {
  if (!schedule || schedule.length === 0) {
    return (
      <div className={`bg-neutral-50 rounded-lg p-4 ${className}`}>
        <p className="text-neutral-500 text-center">
          Schedule information not available
        </p>
      </div>
    );
  }

  const groupedSchedule = groupScheduleByDay(schedule);

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 ${className}`}>
      <div className="px-4 py-3 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-[var(--color-primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          OPD Schedule
        </h3>
      </div>

      <div className="p-4">
        {/* Table View for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 px-3 font-medium text-neutral-700">
                  Day
                </th>
                <th className="text-left py-2 px-3 font-medium text-neutral-700">
                  Time
                </th>
                <th className="text-left py-2 px-3 font-medium text-neutral-700">
                  Slot Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {DAYS_OF_WEEK.map((day, index) => {
                const daySchedules = groupedSchedule.get(index);

                if (!daySchedules || daySchedules.length === 0) {
                  return (
                    <tr
                      key={day}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      <td className="py-2 px-3 text-neutral-900 font-medium">
                        {day}
                      </td>
                      <td className="py-2 px-3 text-neutral-400">Closed</td>
                      <td className="py-2 px-3 text-neutral-400">-</td>
                    </tr>
                  );
                }

                return daySchedules.map((schedule, scheduleIndex) => (
                  <tr
                    key={`${day}-${scheduleIndex}`}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <td className="py-2 px-3 text-neutral-900 font-medium">
                      {scheduleIndex === 0 ? day : ''}
                    </td>
                    <td className="py-2 px-3 text-neutral-700">
                      <span className="inline-flex items-center gap-1">
                        <svg
                          className="h-4 w-4 text-neutral-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-neutral-600">
                      {schedule.slotDuration} min
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>

        {/* Card View for Mobile */}
        <div className="md:hidden space-y-3">
          {DAYS_OF_WEEK.map((day, index) => {
            const daySchedules = groupedSchedule.get(index);
            const isOpen = daySchedules && daySchedules.length > 0;

            return (
              <div
                key={day}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isOpen ? 'bg-green-50' : 'bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      isOpen
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {DAY_ABBREVIATIONS[index]}
                  </span>
                  <div>
                    <p className="font-medium text-neutral-900">{day}</p>
                    {isOpen ? (
                      <div className="space-y-1">
                        {daySchedules.map((schedule, idx) => (
                          <p key={idx} className="text-sm text-neutral-600">
                            {formatTime(schedule.startTime)} -{' '}
                            {formatTime(schedule.endTime)}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-400">Closed</p>
                    )}
                  </div>
                </div>
                {isOpen && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Open
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 rounded-b-lg">
        <p className="text-xs text-neutral-500">
          * Schedule may change during holidays. Please call to confirm.
        </p>
      </div>
    </div>
  );
};
