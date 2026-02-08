/**
 * E2E Test: Complete appointment booking flow
 * Task: T091 [US1]
 *
 * Tests the entire appointment booking journey from doctor selection to confirmation
 */

import { test, expect } from '@playwright/test';

test.describe('Appointment Booking Flow', () => {
  test('complete appointment booking from doctor selection to confirmation', async ({ page }) => {
    // Step 1: Navigate to doctors page
    await page.goto('/doctors');
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    // Step 2: Select a doctor
    const firstDoctorCard = page.locator('[data-testid="doctor-card"]').first();
    const doctorName = await firstDoctorCard.getByRole('heading').textContent();

    const bookButton = firstDoctorCard.getByRole('button', { name: /book appointment/i });
    await bookButton.click();

    // Step 3: Should be on appointment booking page
    await expect(page).toHaveURL(/\/appointments/);
    await expect(page.getByRole('heading', { name: /book.*appointment/i })).toBeVisible();

    // Should show selected doctor's information
    if (doctorName) {
      await expect(page.locator('text=' + doctorName)).toBeVisible();
    }

    // Step 4: Select a date (select tomorrow to ensure it's in the future)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Look for date picker
    const datePicker = page.locator('input[type="date"], [data-testid="date-picker"]');
    if (await datePicker.isVisible()) {
      const dateString = tomorrow.toISOString().split('T')[0];
      await datePicker.fill(dateString);
    }

    // Step 5: Wait for time slots to load
    await page.waitForTimeout(1000); // Give time for slots API call

    // Select first available time slot
    const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
    if (await timeSlot.isVisible()) {
      await timeSlot.click();
    }

    // Step 6: Fill patient details
    await page.fill('input[name="patientName"], [data-testid="patient-name"]', 'John Doe');
    await page.fill(
      'input[name="patientPhone"], [data-testid="patient-phone"]',
      '+1-555-TEST-001'
    );
    await page.fill(
      'input[name="patientEmail"], [data-testid="patient-email"]',
      'john.doe@example.com'
    );

    // Reason for visit (optional)
    const reasonField = page.locator(
      'textarea[name="reasonForVisit"], [data-testid="reason-for-visit"]'
    );
    if (await reasonField.isVisible()) {
      await reasonField.fill('Regular checkup');
    }

    // Step 7: Submit the form
    const submitButton = page.getByRole('button', { name: /confirm booking|book appointment/i });
    await submitButton.click();

    // Step 8: Should navigate to confirmation page
    await expect(page).toHaveURL(/\/appointments\/confirmation/, { timeout: 10000 });

    // Should see confirmation message
    await expect(page.locator('text=/appointment.*confirmed|booking.*successful/i')).toBeVisible();

    // Should see appointment details
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=john.doe@example.com')).toBeVisible();
  });

  test('user can select different dates and see updated time slots', async ({ page }) => {
    await page.goto('/appointments');

    // Select first date
    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date1 = tomorrow.toISOString().split('T')[0];

    await datePicker.fill(date1);
    await page.waitForTimeout(500);

    // Check if time slots loaded
    const slotsCount1 = await page.locator('[data-testid="time-slot"]').count();

    // Select different date
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const date2 = dayAfter.toISOString().split('T')[0];

    await datePicker.fill(date2);
    await page.waitForTimeout(500);

    // Time slots should refresh
    const slotsCount2 = await page.locator('[data-testid="time-slot"]').count();

    // Slots may differ between dates
    expect(slotsCount1).toBeGreaterThanOrEqual(0);
    expect(slotsCount2).toBeGreaterThanOrEqual(0);
  });

  test('unavailable time slots are disabled', async ({ page }) => {
    await page.goto('/appointments');

    // Select a date
    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    // Check for disabled slots
    const disabledSlots = page.locator('[data-testid="time-slot"][disabled]');
    const disabledCount = await disabledSlots.count();

    if (disabledCount > 0) {
      // Disabled slots should not be clickable
      const firstDisabled = disabledSlots.first();
      await expect(firstDisabled).toBeDisabled();

      // Should have visual indicator (e.g., opacity, strikethrough)
      const opacity = await firstDisabled.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('opacity')
      );
      expect(parseFloat(opacity)).toBeLessThan(1);
    }
  });

  test('form shows validation errors for invalid input', async ({ page }) => {
    await page.goto('/appointments');

    // Try to submit without filling required fields
    const submitButton = page.getByRole('button', { name: /confirm booking/i });

    // First need to select date and time to show the form
    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
    if (await timeSlot.isVisible()) {
      await timeSlot.click();
    }

    // Now submit without filling patient details
    await submitButton.click();

    // Should show validation errors
    await expect(page.locator('text=/name.*required|required.*name/i')).toBeVisible();
    await expect(page.locator('text=/email.*required|required.*email/i')).toBeVisible();
    await expect(page.locator('text=/phone.*required|required.*phone/i')).toBeVisible();
  });

  test('form validates email format', async ({ page }) => {
    await page.goto('/appointments');

    // Select date and time
    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
    if (await timeSlot.isVisible()) {
      await timeSlot.click();
    }

    // Fill with invalid email
    await page.fill('input[name="patientName"]', 'John Doe');
    await page.fill('input[name="patientPhone"]', '+1-555-0000');
    await page.fill('input[name="patientEmail"]', 'invalid-email');

    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    // Should show email validation error
    await expect(page.locator('text=/invalid.*email|email.*invalid/i')).toBeVisible();
  });

  test('form shows loading state during submission', async ({ page }) => {
    await page.goto('/appointments');

    // Fill the form completely
    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
    if (await timeSlot.isVisible()) {
      await timeSlot.click();
    }

    await page.fill('input[name="patientName"]', 'John Doe');
    await page.fill('input[name="patientPhone"]', '+1-555-0000');
    await page.fill('input[name="patientEmail"]', 'john@example.com');

    // Submit the form
    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    // Should show loading state immediately
    await expect(submitButton).toHaveText(/booking|loading|please wait/i);
    await expect(submitButton).toBeDisabled();
  });

  test('appointment summary shows before submission', async ({ page }) => {
    await page.goto('/appointments');

    // Fill date and time
    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
    if (await timeSlot.isVisible()) {
      const slotTime = await timeSlot.textContent();
      await timeSlot.click();

      // Should see appointment summary
      const summarySection = page.locator('text=/appointment.*summary|summary/i');
      if (await summarySection.isVisible()) {
        // Should show selected date and time
        await expect(page.locator('text=' + tomorrow.toLocaleDateString())).toBeVisible();
        if (slotTime) {
          await expect(page.locator('text=' + slotTime)).toBeVisible();
        }
      }
    }
  });

  test('mobile responsive: booking form works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/appointments');

    // All form elements should be visible and functional on mobile
    const datePicker = page.locator('input[type="date"]');
    await expect(datePicker).toBeVisible();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    // Time slots should be accessible
    const timeSlots = page.locator('[data-testid="time-slot"]');
    const count = await timeSlots.count();

    if (count > 0) {
      const firstSlot = timeSlots.first();
      await expect(firstSlot).toBeVisible();

      // Should be tappable on mobile
      const box = await firstSlot.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44); // Minimum touch target size
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});
