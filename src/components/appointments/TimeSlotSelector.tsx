/**
 * TimeSlotSelector Component
 *
 * Display available time slots for appointment booking.
 */

'use client';

import React from 'react';

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSlotSelect: (time: string) => void;
  loading?: boolean;
  className?: string;
}

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
 * Group slots by period (Morning, Afternoon, Evening)
 */
function groupSlotsByPeriod(slots: TimeSlot[]): {
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
} {
  const morning: TimeSlot[] = [];
  const afternoon: TimeSlot[] = [];
  const evening: TimeSlot[] = [];

  for (const slot of slots) {
    const hours = parseInt(slot.time.split(':')[0], 10);

    if (hours < 12) {
      morning.push(slot);
    } else if (hours < 17) {
      afternoon.push(slot);
    } else {
      evening.push(slot);
    }
  }

  return { morning, afternoon, evening };
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  slots,
  selectedSlot,
  onSlotSelect,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-neutral-200 p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
          <span className="ml-3 text-neutral-600">Loading available slots...</span>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-neutral-200 p-6 ${className}`}>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-neutral-900 mb-1">
            No slots available
          </h3>
          <p className="text-neutral-500">
            Please select a different date or doctor.
          </p>
        </div>
      </div>
    );
  }

  const groupedSlots = groupSlotsByPeriod(slots);
  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 ${className}`}>
      {/* Header */}
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Available Time Slots
        </h3>
        <p className="text-sm text-neutral-500 mt-1">
          {availableCount} slot{availableCount !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Morning Slots */}
        {groupedSlots.morning.length > 0 && (
          <SlotGroup
            title="Morning"
            icon={
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            }
            slots={groupedSlots.morning}
            selectedSlot={selectedSlot}
            onSlotSelect={onSlotSelect}
          />
        )}

        {/* Afternoon Slots */}
        {groupedSlots.afternoon.length > 0 && (
          <SlotGroup
            title="Afternoon"
            icon={
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
            slots={groupedSlots.afternoon}
            selectedSlot={selectedSlot}
            onSlotSelect={onSlotSelect}
          />
        )}

        {/* Evening Slots */}
        {groupedSlots.evening.length > 0 && (
          <SlotGroup
            title="Evening"
            icon={
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            }
            slots={groupedSlots.evening}
            selectedSlot={selectedSlot}
            onSlotSelect={onSlotSelect}
          />
        )}
      </div>
    </div>
  );
};

interface SlotGroupProps {
  title: string;
  icon: React.ReactNode;
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSlotSelect: (time: string) => void;
}

const SlotGroup: React.FC<SlotGroupProps> = ({
  title,
  icon,
  slots,
  selectedSlot,
  onSlotSelect,
}) => {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
        <span className="text-neutral-400">{icon}</span>
        {title}
      </h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            onClick={() => slot.available && onSlotSelect(slot.time)}
            disabled={!slot.available}
            className={`
              px-3 py-2 text-sm rounded-lg border transition-all
              ${
                selectedSlot === slot.time
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-medium'
                  : slot.available
                  ? 'bg-white text-neutral-700 border-neutral-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                  : 'bg-neutral-50 text-neutral-400 border-neutral-100 cursor-not-allowed line-through'
              }
            `}
            title={slot.available ? '' : slot.reason || 'Unavailable'}
            aria-selected={selectedSlot === slot.time}
          >
            {formatTime(slot.time)}
          </button>
        ))}
      </div>
    </div>
  );
};
