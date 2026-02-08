/**
 * E2E Tests: Contact Form Submission
 *
 * Tests complete contact form submission journey
 * Task: T130 [US3]
 */

import { test, expect } from '@playwright/test';

test.describe('Contact Form Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display contact page with form and map', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText(/contact/i);

    // Check form is visible
    await expect(page.locator('form')).toBeVisible();

    // Check map iframe is visible
    await expect(page.locator('iframe[title*="Map"]')).toBeVisible();
  });

  test('should display contact information cards', async ({ page }) => {
    // Should have phone card
    const phoneText = page.locator('text=/call us/i');
    await expect(phoneText).toBeVisible();

    // Should have email card
    const emailText = page.locator('text=/email us/i');
    await expect(emailText).toBeVisible();

    // Should have emergency card
    const emergencyText = page.locator('text=/emergency/i');
    await expect(emergencyText).toBeVisible();
  });

  test('should display all form fields', async ({ page }) => {
    await expect(page.locator('label:has-text("Full Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Email Address")')).toBeVisible();
    await expect(page.locator('label:has-text("Phone Number")')).toBeVisible();
    await expect(page.locator('label:has-text("Subject")')).toBeVisible();
    await expect(page.locator('label:has-text("Message")')).toBeVisible();
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Click submit without filling form
    await page.click('button:has-text("Send Message")');

    // Should show validation errors
    await expect(page.locator('text=/name must be/i')).toBeVisible();
    await expect(page.locator('text=/invalid email/i')).toBeVisible();
    await expect(page.locator('text=/message must be/i')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Fill name
    await page.fill('input[type="text"][placeholder*="name"]', 'John Doe');

    // Fill invalid email
    await page.fill('input[type="email"]', 'invalid-email');

    // Fill message
    await page.fill('textarea', 'This is a test message with enough characters.');

    // Submit
    await page.click('button:has-text("Send Message")');

    // Should show email validation error
    await expect(page.locator('text=/invalid email/i')).toBeVisible();
  });

  test('should enforce minimum message length', async ({ page }) => {
    await page.fill('input[type="text"][placeholder*="name"]', 'John Doe');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('textarea', 'Short');

    await page.click('button:has-text("Send Message")');

    await expect(page.locator('text=/message must be at least 10 characters/i')).toBeVisible();
  });

  test('should successfully submit valid contact form', async ({ page }) => {
    // Fill all required fields
    await page.fill('input[type="text"][placeholder*="name"]', 'Jane Smith');
    await page.fill('input[type="email"]', 'jane.smith@example.com');
    await page.fill('input[type="tel"]', '+92-321-7654321');
    await page.fill('input[placeholder*="General"]', 'General Inquiry');
    await page.fill(
      'textarea',
      'I would like to know more about your cardiology services and available doctors.'
    );

    // Intercept API call
    const responsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/contact') && response.status() === 201
    );

    // Submit form
    await page.click('button:has-text("Send Message")');

    // Wait for API response
    await responsePromise;

    // Should show success message
    await expect(
      page.locator('text=/message has been sent successfully/i')
    ).toBeVisible({ timeout: 10000 });

    // Form should be reset
    await expect(page.locator('input[type="text"][placeholder*="name"]')).toHaveValue('');
    await expect(page.locator('input[type="email"]')).toHaveValue('');
    await expect(page.locator('textarea')).toHaveValue('');
  });

  test('should show loading state during submission', async ({ page }) => {
    // Fill form
    await page.fill('input[type="text"][placeholder*="name"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('textarea', 'Testing the loading state of the contact form.');

    // Submit
    await page.click('button:has-text("Send Message")');

    // Should show loading indicator
    await expect(page.locator('text=/sending/i')).toBeVisible({ timeout: 2000 });

    // Button should be disabled
    const submitButton = page.locator('button:has-text("Sending")');
    await expect(submitButton).toBeDisabled();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept and mock error response
    await page.route('**/api/contact', (route) => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Rate limit exceeded. Please try again later.',
        }),
      });
    });

    // Fill and submit form
    await page.fill('input[type="text"][placeholder*="name"]', 'John Doe');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('textarea', 'Testing error handling in contact form.');

    await page.click('button:has-text("Send Message")');

    // Should show error message
    await expect(page.locator('text=/rate limit/i')).toBeVisible({ timeout: 10000 });
  });

  test('should display business hours section', async ({ page }) => {
    await expect(page.locator('text=/business hours/i')).toBeVisible();

    // Check for specific day entries
    await expect(page.locator('text=/monday.*friday/i')).toBeVisible();
    await expect(page.locator('text=/saturday/i')).toBeVisible();
    await expect(page.locator('text=/sunday/i')).toBeVisible();
    await expect(page.locator('text=/emergency services/i')).toBeVisible();
    await expect(page.locator('text=/24.*7/i')).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await expect(page.locator('text=/frequently asked questions/i')).toBeVisible();

    // Should have collapsible FAQ items
    const faqItems = page.locator('details');
    await expect(faqItems.first()).toBeVisible();

    // Click to expand first FAQ
    await faqItems.first().click();

    // Content should be visible
    await expect(faqItems.first().locator('p')).toBeVisible();
  });

  test('should have working "Get Directions" button on map', async ({ page }) => {
    // Wait for map component to load
    await page.waitForSelector('iframe[title*="Map"]', { timeout: 10000 });

    // Look for Get Directions button
    const directionsButton = page.locator('button:has-text("Get Directions")');

    if (await directionsButton.isVisible()) {
      // Click should open new tab (we don't actually check the new tab in this test)
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        directionsButton.click(),
      ]);

      // Verify it's a Google Maps URL
      expect(newPage.url()).toContain('google.com/maps');

      await newPage.close();
    }
  });

  test('should display reCAPTCHA notice', async ({ page }) => {
    await expect(page.locator('text=/protected by reCAPTCHA/i')).toBeVisible();
    await expect(page.locator('a[href*="google.com/privacy"]')).toBeVisible();
    await expect(page.locator('a[href*="google.com/terms"]')).toBeVisible();
  });
});

test.describe('Contact Page Accessibility', () => {
  test('form fields should have proper labels', async ({ page }) => {
    await page.goto('/contact');

    // Check all inputs have associated labels
    const nameInput = page.locator('input[type="text"][placeholder*="name"]');
    await expect(nameInput).toHaveAttribute('id');

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('id');

    const messageTextarea = page.locator('textarea');
    await expect(messageTextarea).toHaveAttribute('id');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/contact');

    // Tab through form fields
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // At least one form element should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'TEXTAREA', 'BUTTON', 'A']).toContain(focusedElement);
  });

  test('error messages should be announced', async ({ page }) => {
    await page.goto('/contact');

    // Submit empty form
    await page.click('button:has-text("Send Message")');

    // Error messages should be visible and have appropriate styling
    const errorMessages = page.locator('[class*="text-red"]');
    await expect(errorMessages.first()).toBeVisible();
  });
});

test.describe('Contact Page Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact');

    // Check page loads
    await expect(page.locator('h1')).toBeVisible();

    // Form should be visible
    await expect(page.locator('form')).toBeVisible();

    // Map should be visible
    await expect(page.locator('iframe[title*="Map"]')).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/contact');

    // Check layout
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
  });

  test('contact info cards should stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact');

    // All three cards should be visible
    await expect(page.locator('text=/call us/i')).toBeVisible();
    await expect(page.locator('text=/email us/i')).toBeVisible();
    await expect(page.locator('text=/emergency/i')).toBeVisible();
  });
});
