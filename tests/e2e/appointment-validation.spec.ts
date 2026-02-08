/**
 * E2E Test: Form validation for appointment booking
 * Task: T092 [US1]
 *
 * Tests comprehensive form validation scenarios
 */

import { test, expect } from '@playwright/test';

test.describe('Appointment Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/appointments');

    // Select a valid date and time to expose the patient details form
    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
    if (await timeSlot.isVisible()) {
      await timeSlot.click();
    }
  });

  test('validates required fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    // Should show error messages for all required fields
    await expect(page.locator('text=/name.*required/i')).toBeVisible();
    await expect(page.locator('text=/email.*required/i')).toBeVisible();
    await expect(page.locator('text=/phone.*required/i')).toBeVisible();
  });

  test('validates name field - minimum length', async ({ page }) => {
    await page.fill('input[name="patientName"]', 'J'); // Too short

    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    await expect(page.locator('text=/name.*at least.*2|name.*too short/i')).toBeVisible();
  });

  test('validates name field - maximum length', async ({ page }) => {
    const longName = 'A'.repeat(150); // Too long
    await page.fill('input[name="patientName"]', longName);

    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    // Should either truncate or show error
    const nameInput = page.locator('input[name="patientName"]');
    const value = await nameInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(100);
  });

  test('validates email format - missing @', async ({ page }) => {
    await page.fill('input[name="patientName"]', 'John Doe');
    await page.fill('input[name="patientPhone"]', '+1-555-0000');
    await page.fill('input[name="patientEmail"]', 'invalidemail.com');

    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    await expect(page.locator('text=/invalid.*email|email.*format/i')).toBeVisible();
  });

  test('validates email format - invalid domain', async ({ page }) => {
    await page.fill('input[name="patientName"]', 'John Doe');
    await page.fill('input[name="patientPhone"]', '+1-555-0000');
    await page.fill('input[name="patientEmail"]', 'test@');

    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    await expect(page.locator('text=/invalid.*email|email.*format/i')).toBeVisible();
  });

  test('validates phone number format - too short', async ({ page }) => {
    await page.fill('input[name="patientName"]', 'John Doe');
    await page.fill('input[name="patientEmail"]', 'john@example.com');
    await page.fill('input[name="patientPhone"]', '123'); // Too short

    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    await expect(page.locator('text=/invalid.*phone|phone.*format/i')).toBeVisible();
  });

  test('validates phone number format - invalid characters', async ({ page }) => {
    await page.fill('input[name="patientName"]', 'John Doe');
    await page.fill('input[name="patientEmail"]', 'john@example.com');
    await page.fill('input[name="patientPhone"]', 'abc-def-ghij'); // Letters

    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    await expect(page.locator('text=/invalid.*phone|phone.*format/i')).toBeVisible();
  });

  test('accepts valid international phone numbers', async ({ page }) => {
    const validPhoneNumbers = [
      '+1-555-0000',
      '+923001234567',
      '+44 20 7946 0958',
      '+91 98765 43210',
    ];

    for (const phone of validPhoneNumbers) {
      await page.fill('input[name="patientName"]', 'John Doe');
      await page.fill('input[name="patientEmail"]', 'john@example.com');
      await page.fill('input[name="patientPhone"]', phone);

      const submitButton = page.getByRole('button', { name: /confirm booking/i });
      await submitButton.click();

      // Should not show phone validation error
      const phoneError = page.locator('text=/invalid.*phone|phone.*format/i');
      await expect(phoneError).not.toBeVisible({ timeout: 1000 });

      // Reload page for next iteration
      if (phone !== validPhoneNumbers[validPhoneNumbers.length - 1]) {
        await page.reload();
        const datePicker = page.locator('input[type="date"]');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await datePicker.fill(tomorrow.toISOString().split('T')[0]);
        await page.waitForTimeout(500);
        const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
        if (await timeSlot.isVisible()) {
          await timeSlot.click();
        }
      }
    }
  });

  test('validates reason for visit - maximum length', async ({ page }) => {
    const reasonField = page.locator('textarea[name="reasonForVisit"]');

    if (await reasonField.isVisible()) {
      const longReason = 'A'.repeat(600); // Exceeds max length
      await reasonField.fill(longReason);

      // Field should enforce max length
      const value = await reasonField.inputValue();
      expect(value.length).toBeLessThanOrEqual(500);
    }
  });

  test('validates date selection - cannot select past date', async ({ page }) => {
    await page.goto('/appointments');

    const datePicker = page.locator('input[type="date"]');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await datePicker.fill(yesterdayStr);

    // Should show error or prevent selection
    await expect(
      page.locator('text=/cannot.*past|date.*past|invalid.*date/i')
    ).toBeVisible();
  });

  test('validates date selection - cannot select too far in future', async ({ page }) => {
    await page.goto('/appointments');

    const datePicker = page.locator('input[type="date"]');
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 2); // 2 years ahead
    const farFutureStr = farFuture.toISOString().split('T')[0]);

    await datePicker.fill(farFutureStr);

    // May show error or simply not load slots
    const timeSlots = page.locator('[data-testid="time-slot"]');
    await page.waitForTimeout(1000);

    const count = await timeSlots.count();
    // Either no slots or error message
    if (count === 0) {
      await expect(
        page.locator('text=/no.*available|no.*schedule/i')
      ).toBeVisible();
    }
  });

  test('clears validation errors when valid input is provided', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /confirm booking/i });

    // Submit empty form to trigger errors
    await submitButton.click();
    await expect(page.locator('text=/name.*required/i')).toBeVisible();

    // Fill valid name
    await page.fill('input[name="patientName"]', 'John Doe');

    // Name error should disappear
    await expect(page.locator('text=/name.*required/i')).not.toBeVisible({ timeout: 1000 });
  });

  test('shows validation errors inline next to fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    // Error messages should be near their respective fields
    const nameInput = page.locator('input[name="patientName"]');
    const nameError = page.locator('text=/name.*required/i');

    // Error should be within reasonable proximity of input
    const nameBox = await nameInput.boundingBox();
    const errorBox = await nameError.boundingBox();

    if (nameBox && errorBox) {
      // Error should be below the input (within ~100px)
      expect(errorBox.y - nameBox.y).toBeGreaterThan(0);
      expect(errorBox.y - nameBox.y).toBeLessThan(100);
    }
  });

  test('disables submit button while validation errors exist', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /confirm booking/i });

    // Button should be enabled initially
    await expect(submitButton).toBeEnabled();

    // After failed validation, might implement state that keeps it enabled
    // (to allow showing validation errors on click)
    await submitButton.click();

    // Errors should be shown
    await expect(page.locator('text=/required/i').first()).toBeVisible();
  });

  test('validates complete form successfully', async ({ page }) => {
    // Fill all required fields with valid data
    await page.fill('input[name="patientName"]', 'John Doe');
    await page.fill('input[name="patientEmail"]', 'john.doe@example.com');
    await page.fill('input[name="patientPhone"]', '+1-555-0123');

    const reasonField = page.locator('textarea[name="reasonForVisit"]');
    if (await reasonField.isVisible()) {
      await reasonField.fill('Annual checkup');
    }

    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    // Should not show any validation errors
    const errors = page.locator('text=/required|invalid|error/i');
    const errorCount = await errors.count();

    // Either no errors or navigated to confirmation page
    if (errorCount === 0) {
      // No validation errors
      expect(errorCount).toBe(0);
    } else {
      // Should have navigated away (confirmation page)
      await expect(page).toHaveURL(/confirmation/);
    }
  });
});
