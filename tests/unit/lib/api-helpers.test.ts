/**
 * Unit Tests for API Helpers
 *
 * Tests API response helpers, error handling, and utility functions.
 */

import { describe, it, expect } from 'vitest';
import {
  successResponse,
  createdResponse,
  errorResponse,
  badRequestResponse,
  notFoundResponse,
  validationErrorResponse,
  HTTP_STATUS,
  getQueryParams,
  getPaginationParams,
  getErrorMessage,
} from '@/lib/utils/api-helpers';

describe('API Helpers', () => {
  describe('Success Responses', () => {
    it('should create success response with data', async () => {
      const data = { id: '1', name: 'Test' };
      const response = successResponse(data);

      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toEqual(data);
    });

    it('should create success response with custom status', async () => {
      const data = { message: 'Custom status' };
      const response = successResponse(data, undefined, 202);

      expect(response.status).toBe(202);
    });

    it('should create created response (201)', async () => {
      const data = { id: '1' };
      const response = createdResponse(data);

      expect(response.status).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toEqual(data);
    });
  });

  describe('Error Responses', () => {
    it('should create error response with code and message', async () => {
      const response = errorResponse('TEST_ERROR', 'Test error message', 500);

      expect(response.status).toBe(500);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('TEST_ERROR');
      expect(json.error.message).toBe('Test error message');
    });

    it('should create bad request response (400)', async () => {
      const response = badRequestResponse('Invalid input');

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error.code).toBe('BAD_REQUEST');
      expect(json.error.message).toBe('Invalid input');
    });

    it('should create not found response (404)', async () => {
      const response = notFoundResponse('Doctor');

      expect(response.status).toBe(404);

      const json = await response.json();
      expect(json.error.code).toBe('NOT_FOUND');
      expect(json.error.message).toContain('Doctor not found');
    });

    it('should create validation error response (422)', async () => {
      const errors = {
        email: 'Invalid email',
        name: 'Name is required',
      };
      const response = validationErrorResponse('Validation failed', errors);

      expect(response.status).toBe(422);

      const json = await response.json();
      expect(json.error.code).toBe('VALIDATION_ERROR');
      expect(json.error.details.errors).toEqual(errors);
    });
  });

  describe('HTTP Status Codes', () => {
    it('should have correct status code constants', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe('Query Parameter Parsing', () => {
    it('should parse query parameters from URL', () => {
      const url = 'http://localhost:3000/api/doctors?specialty=cardiology&active=true';
      const params = getQueryParams(url);

      expect(params.specialty).toBe('cardiology');
      expect(params.active).toBe('true');
    });

    it('should return empty object for URL with no params', () => {
      const url = 'http://localhost:3000/api/doctors';
      const params = getQueryParams(url);

      expect(params).toEqual({});
    });

    it('should handle special characters in query params', () => {
      const url = 'http://localhost:3000/api/search?q=heart+disease&filter=top';
      const params = getQueryParams(url);

      expect(params.q).toBe('heart disease');
      expect(params.filter).toBe('top');
    });
  });

  describe('Pagination Parameters', () => {
    it('should parse pagination params with defaults', () => {
      const url = 'http://localhost:3000/api/doctors';
      const params = getPaginationParams(url);

      expect(params.page).toBe(1);
      expect(params.limit).toBe(10);
      expect(params.skip).toBe(0);
    });

    it('should parse custom pagination params', () => {
      const url = 'http://localhost:3000/api/doctors?page=3&limit=20';
      const params = getPaginationParams(url);

      expect(params.page).toBe(3);
      expect(params.limit).toBe(20);
      expect(params.skip).toBe(40); // (3-1) * 20
    });

    it('should enforce minimum page of 1', () => {
      const url = 'http://localhost:3000/api/doctors?page=0';
      const params = getPaginationParams(url);

      expect(params.page).toBe(1);
      expect(params.skip).toBe(0);
    });

    it('should enforce maximum limit of 100', () => {
      const url = 'http://localhost:3000/api/doctors?limit=200';
      const params = getPaginationParams(url);

      expect(params.limit).toBe(100);
    });

    it('should enforce minimum limit of 1', () => {
      const url = 'http://localhost:3000/api/doctors?limit=0';
      const params = getPaginationParams(url);

      expect(params.limit).toBe(1);
    });

    it('should handle invalid pagination params', () => {
      const url = 'http://localhost:3000/api/doctors?page=abc&limit=xyz';
      const params = getPaginationParams(url);

      expect(params.page).toBe(1);
      expect(params.limit).toBe(10);
    });
  });

  describe('Error Message Extraction', () => {
    it('should extract message from Error object', () => {
      const error = new Error('Test error');
      const message = getErrorMessage(error);

      expect(message).toBe('Test error');
    });

    it('should return string error as-is', () => {
      const error = 'String error message';
      const message = getErrorMessage(error);

      expect(message).toBe('String error message');
    });

    it('should handle unknown error types', () => {
      const error = { someProperty: 'value' };
      const message = getErrorMessage(error);

      expect(message).toBe('An unknown error occurred');
    });

    it('should handle null/undefined errors', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred');
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
    });
  });
});
