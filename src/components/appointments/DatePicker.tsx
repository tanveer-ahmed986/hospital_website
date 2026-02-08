/**
 * DatePicker Component
 *
 * Calendar-based date picker for appointment booking.
 */

'use client';

import React, { useState, useMemo } from 'react';

export interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  availableDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  className?: string;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
  availableDays?: number[]
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if date is in the past
  if (date < today) return true;

  // Check min date
  if (minDate && date < minDate) return true;

  // Check max date
  if (maxDate && date > maxDate) return true;

  // Check if day of week is available
  if (availableDays && availableDays.length > 0) {
    if (!availableDays.includes(date.getDay())) return true;
  }

  // Check disabled dates
  if (disabledDates) {
    for (const disabledDate of disabledDates) {
      if (isSameDay(date, disabledDate)) return true;
    }
  }

  return false;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  disabledDates,
  availableDays,
  className = '',
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  }, [currentMonth, currentYear]);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Disable previous month button if it would go before today
  const canGoPrevious = useMemo(() => {
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastDayOfPreviousMonth = new Date(previousYear, previousMonth + 1, 0);
    return lastDayOfPreviousMonth >= today;
  }, [currentMonth, currentYear]);

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="h-5 w-5 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-neutral-900">
          {MONTHS[currentMonth]} {currentYear}
        </h2>

        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Next month"
        >
          <svg
            className="h-5 w-5 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-neutral-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="p-2" />;
          }

          const disabled = isDateDisabled(
            date,
            minDate,
            maxDate,
            disabledDates,
            availableDays
          );
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => !disabled && onDateSelect(date)}
              disabled={disabled}
              className={`
                p-2 text-sm rounded-lg transition-all
                ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white font-semibold'
                    : isToday
                    ? 'bg-[var(--color-primary-100,#e0f2fe)] text-[var(--color-primary)] font-medium'
                    : disabled
                    ? 'text-neutral-300 cursor-not-allowed'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }
              `}
              aria-label={date.toLocaleDateString()}
              aria-selected={isSelected || undefined}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap gap-4 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[var(--color-primary)]" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[var(--color-primary-100,#e0f2fe)]" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-neutral-100 border border-neutral-200" />
          <span>Available</span>
        </div>
      </div>
    </div>
  );
};
