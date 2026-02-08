/**
 * Services API Route
 *
 * GET /api/services - Get all services or search/filter
 * Task: T109 [US2]
 */

import { NextRequest } from 'next/server';
import { getAllServices, getServicesByCategory, searchServices } from '@/lib/services';
import { successResponse, getQueryParam } from '@/lib/utils/api-helpers';
import { asyncHandler } from '@/lib/utils/error-handler';
import { rateLimiters } from '@/lib/utils/rate-limit';

export const GET = asyncHandler(async (request: NextRequest) => {
  // Apply rate limiting
  const rateLimitResult = await rateLimiters.general(request);
  if (rateLimitResult) return rateLimitResult;

  const url = request.url;

  // Check for query parameters
  const searchQuery = getQueryParam(url, 'search');
  const categorySlug = getQueryParam(url, 'category');

  let services;

  if (searchQuery) {
    // Search services by name
    services = await searchServices(searchQuery);
  } else if (categorySlug) {
    // Filter by category
    services = await getServicesByCategory(categorySlug);
  } else {
    // Get all services
    services = await getAllServices();
  }

  return successResponse({
    services,
    total: services.length,
  });
});

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
