/**
 * Departments API Route
 *
 * GET /api/departments - Get all departments
 * Task: T102 [US2]
 */

import { NextRequest } from 'next/server';
import {  getAllDepartments, searchDepartments } from '@/lib/departments';
import { successResponse, getQueryParam } from '@/lib/utils/api-helpers';
import { asyncHandler } from '@/lib/utils/error-handler';
import { rateLimiters } from '@/lib/utils/rate-limit';

export const GET = asyncHandler(async (request: NextRequest) => {
  // Apply rate limiting
  const rateLimitResult = await rateLimiters.general(request);
  if (rateLimitResult) return rateLimitResult;

  const url = request.url;

  // Check for search query
  const searchQuery = getQueryParam(url, 'search');

  let departments;

  if (searchQuery) {
    // Search departments by name
    departments = await searchDepartments(searchQuery);
  } else {
    // Get all departments
    departments = await getAllDepartments();
  }

  return successResponse({
    departments,
    total: departments.length,
  });
});

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
