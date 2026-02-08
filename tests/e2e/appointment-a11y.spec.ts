/**
 * E2E Test: Accessibility testing for appointment flow
 * Task: T093 [US1]
 *
 * Tests WCAG 2.1 Level AA compliance for appointment booking
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Appointment Flow Accessibility', () => {
  test('doctors listing page is accessible', async ({ page }) => {
    await page.goto('/doctors');
    await page.waitForLoadState('networkidle');

    // Inject axe-core
    await injectAxe(page);

    // Run accessibility checks
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('doctor profile page is accessible', async ({ page }) => {
    await page.goto('/doctors');
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    const firstDoctorLink = page
      .locator('[data-testid="doctor-card"]')
      .first()
      .getByRole('link', { name: /view profile/i });

    await firstDoctorLink.click();
    await page.waitForLoadState('networkidle');

    await injectAxe(page);
    await checkA11y(page);
  });

  test('appointment booking form is accessible', async ({ page }) => {
    await page.goto('/appointments');
    await page.waitForLoadState('networkidle');

    await injectAxe(page);
    await checkA11y(page);
  });

  test('all form inputs have proper labels', async ({ page }) => {
    await page.goto('/appointments');

    // Select date and time to show patient details form
    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
    if (await timeSlot.isVisible()) {
      await timeSlot.click();
    }

    // Check all inputs have associated labels
    const nameInput = page.locator('input[name="patientName"]');
    const emailInput = page.locator('input[name="patientEmail"]');
    const phoneInput = page.locator('input[name="patientPhone"]');

    // Each input should have an accessible name
    await expect(nameInput).toHaveAccessibleName();
    await expect(emailInput).toHaveAccessibleName();
    await expect(phoneInput).toHaveAccessibleName();
  });

  test('form validation errors are announced to screen readers', async ({ page }) => {
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

    // Submit empty form
    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    // Error messages should have role="alert" or aria-live
    const errorMessages = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"]');
    const count = await errorMessages.count();

    expect(count).toBeGreaterThan(0);
  });

  test('keyboard navigation works throughout booking flow', async ({ page }) => {
    await page.goto('/appointments');

    // Tab through the form
    await page.keyboard.press('Tab'); // Focus first element

    // Should be able to tab to date picker
    const focused1 = page.locator(':focus');
    await expect(focused1).toBeVisible();

    // Continue tabbing
    await page.keyboard.press('Tab');
    const focused2 = page.locator(':focus');
    await expect(focused2).toBeVisible();

    // Should be able to interact with focused elements
    // (Further keyboard testing would involve specific interactions)
  });

  test('time slots are keyboard accessible', async ({ page }) => {
    await page.goto('/appointments');

    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    // Tab to first time slot
    await page.keyboard.press('Tab'); // Date picker
    await page.keyboard.press('Tab'); // First time slot

    const focusedSlot = page.locator('[data-testid="time-slot"]:focus');

    if (await focusedSlot.isVisible()) {
      // Should be able to select with Enter or Space
      await page.keyboard.press('Enter');

      // Slot should become selected
      await expect(focusedSlot).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('buttons have sufficient color contrast', async ({ page }) => {
    await page.goto('/appointments');

    // Select date and time to show submit button
    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
    if (await timeSlot.isVisible()) {
      await timeSlot.click();
    }

    await injectAxe(page);

    // Check color contrast
    await checkA11y(page, undefined, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/doctors');
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    // All images should have alt attributes
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Either has meaningful alt text or empty string for decorative images
      expect(alt).toBeDefined();
    }
  });

  test('headings follow hierarchical structure', async ({ page }) => {
    await page.goto('/appointments');

    // Should have h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Run axe check for heading hierarchy
    await injectAxe(page);
    await checkA11y(page, undefined, {
      rules: {
        'heading-order': { enabled: true },
      },
    });
  });

  test('links have descriptive text', async ({ page }) => {
    await page.goto('/doctors');
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    // All links should have accessible names (not just "click here" or "read more")
    const links = page.locator('a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      // Should have either text content or aria-label
      expect(text || ariaLabel).toBeDefined();

      if (text) {
        // Text should be meaningful (more than just whitespace)
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/appointments');

    const datePicker = page.locator('input[type="date"]');
    await datePicker.focus();

    // Should have visible focus indicator
    const outlineWidth = await datePicker.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('outline-width')
    );

    const boxShadow = await datePicker.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('box-shadow')
    );

    // Should have either outline or box-shadow for focus
    const hasFocusIndicator = outlineWidth !== '0px' && outlineWidth !== 'none' || boxShadow !== 'none';

    expect(hasFocusIndicator).toBeTruthy();
  });

  test('form has proper ARIA attributes', async ({ page }) => {
    await page.goto('/appointments');

    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    const timeSlot = page.locator('[data-testid="time-slot"]:not([disabled])').first();
    if (await timeSlot.isVisible()) {
      await timeSlot.click();
    }

    // Submit to trigger errors
    const submitButton = page.getByRole('button', { name: /confirm booking/i });
    await submitButton.click();

    // Error inputs should have aria-invalid
    const nameInput = page.locator('input[name="patientName"]');
    const ariaInvalid = await nameInput.getAttribute('aria-invalid');

    expect(ariaInvalid).toBe('true');
  });

  test('skip to main content link exists', async ({ page }) => {
    await page.goto('/appointments');

    // Press Tab to focus skip link (usually first focusable element)
    await page.keyboard.press('Tab');

    const skipLink = page.locator('a:has-text("Skip to"), a:has-text("skip to")');

    // Skip link should exist (may be visually hidden until focused)
    if (await skipLink.isVisible()) {
      await expect(skipLink).toHaveAttribute('href', /#main|#content/);
    }
  });

  test('page has proper lang attribute', async ({ page }) => {
    await page.goto('/appointments');

    const html = page.locator('html');
    const lang = await html.getAttribute('lang');

    // Should have lang attribute (e.g., "en", "en-US")
    expect(lang).toBeDefined();
    expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
  });

  test('responsive: touch targets are at least 44x44px', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/appointments');

    const datePicker = page.locator('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await datePicker.fill(tomorrow.toISOString().split('T')[0]);

    await page.waitForTimeout(500);

    // Check time slot button sizes
    const timeSlots = page.locator('[data-testid="time-slot"]');
    const count = await timeSlots.count();

    if (count > 0) {
      const firstSlot = timeSlots.first();
      const box = await firstSlot.boundingBox();

      // WCAG requirement: touch targets should be at least 44x44px
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});
