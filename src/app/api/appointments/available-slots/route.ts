/**
 * Available Slots API Route
 *
 * GET /api/appointments/available-slots?doctorId=xxx&date=YYYY-MM-DD
 */

import { NextRequest } from 'next/server';
import { getAvailableSlots } from '@/lib/appointments';
import { successResponse, getQueryParam } from '@/lib/utils/api-helpers';
import { asyncHandler, ValidationError } from '@/lib/utils/error-handler';
import { rateLimiters } from '@/lib/utils/rate-limit';

export const GET = asyncHandler(async (request: NextRequest) => {
  // Apply rate limiting for slot checks (T089)
  const rateLimitResult = await rateLimiters.slotCheck(request);
  if (rateLimitResult) return rateLimitResult;

  const url = request.url;

  // Get query parameters
  const doctorId = getQueryParam(url, 'doctorId');
  const dateString = getQueryParam(url, 'date');

  if (!doctorId || !dateString) {
    throw new ValidationError('doctorId and date are required');
  }

  // Parse and validate date
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new ValidationError('Invalid date format. Use YYYY-MM-DD');
  }

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    throw new ValidationError('Cannot get slots for past dates');
  }

  // Get available slots
  const slots = await getAvailableSlots(doctorId, date);

  return successResponse({
    doctorId,
    date: dateString,
    slots,
  });
});

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
