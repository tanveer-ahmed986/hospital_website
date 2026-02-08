/**
 * Test Setup File for Vitest and React Testing Library
 *
 * Configures global test environment, matchers, and utilities.
 * Includes accessibility testing configuration with axe-core.
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables for tests
// @ts-expect-error - NODE_ENV is writable in tests
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.HOSPITAL_ID = 'test-hospital';

// Configure axe-core for accessibility testing
// Note: axe-core Playwright integration is configured in individual E2E test files
// For component tests with React Testing Library, use @testing-library/jest-dom matchers
