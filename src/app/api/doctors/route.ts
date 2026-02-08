/**
 * Doctors API Route
 *
 * GET /api/doctors - List doctors with filters
 */

import { NextRequest } from 'next/server';
import { getDoctors } from '@/lib/doctors';
import { doctorFilterSchema } from '@/lib/utils/validation';
import {
  paginatedResponse,
  getQueryParams,
  getPaginationParams,
} from '@/lib/utils/api-helpers';
import { asyncHandler } from '@/lib/utils/error-handler';

export const GET = asyncHandler(async (request: NextRequest) => {
  // Parse query parameters
  const url = request.url;
  const queryParams = getQueryParams(url);
  const { page, limit } = getPaginationParams(url);

  // Validate and parse filters
  const filters = doctorFilterSchema.parse({
    ...queryParams,
    page,
    limit,
    languages: queryParams.languages ? queryParams.languages.split(',') : undefined,
  });

  // Fetch doctors
  const { doctors, total } = await getDoctors(filters);

  // Return paginated response
  return paginatedResponse(doctors, filters.page, filters.limit, total);
});

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
