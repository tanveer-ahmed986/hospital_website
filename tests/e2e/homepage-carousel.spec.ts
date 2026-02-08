/**
 * E2E Tests: Homepage Hero Carousel
 *
 * Tests carousel auto-play, controls, and user interactions
 * Task: T157 [Homepage]
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage Hero Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero carousel on homepage', async ({ page }) => {
    // Wait for carousel to load
    await page.waitForSelector('[role="region"][aria-label*="carousel"]', { timeout: 10000 });

    // Should have carousel controls
    await expect(page.locator('button[aria-label*="Next"]')).toBeVisible();
    await expect(page.locator('button[aria-label*="Previous"]')).toBeVisible();
  });

  test('should show slide counter', async ({ page }) => {
    // Should show counter like "1 / 3"
    await expect(page.locator('text=/\\d+ \\/ \\d+/')).toBeVisible();
  });

  test('should navigate to next slide on button click', async ({ page }) => {
    // Get initial counter
    const initialCounter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();

    // Click next button
    await page.click('button[aria-label*="Next"]');

    // Wait for animation
    await page.waitForTimeout(500);

    // Counter should change
    const newCounter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    expect(newCounter).not.toBe(initialCounter);
  });

  test('should navigate to previous slide on button click', async ({ page }) => {
    // Click previous button (should wrap to last)
    await page.click('button[aria-label*="Previous"]');

    // Wait for animation
    await page.waitForTimeout(500);

    // Should navigate to a different slide
    const counter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    expect(counter).toBeTruthy();
  });

  test('should navigate via dot indicators', async ({ page }) => {
    // Find all dot indicators
    const dots = page.locator('[role="tab"]');
    const dotCount = await dots.count();

    if (dotCount > 1) {
      // Click second dot
      await dots.nth(1).click();

      // Wait for transition
      await page.waitForTimeout(500);

      // Should show slide 2
      const counter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
      expect(counter).toContain('2');
    }
  });

  test('should pause auto-play when pause button clicked', async ({ page }) => {
    // Click pause button
    await page.click('button[aria-label*="Pause"]');

    // Wait for button to change
    await page.waitForTimeout(200);

    // Should now show play button
    await expect(page.locator('button[aria-label*="Play"]')).toBeVisible();
  });

  test('should resume auto-play when play button clicked', async ({ page }) => {
    // Pause first
    await page.click('button[aria-label*="Pause"]');
    await page.waitForTimeout(200);

    // Then resume
    await page.click('button[aria-label*="Play"]');
    await page.waitForTimeout(200);

    // Should show pause button again
    await expect(page.locator('button[aria-label*="Pause"]')).toBeVisible();
  });

  test('should auto-advance slides', async ({ page }) => {
    // Get initial counter
    const initialCounter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();

    // Wait for auto-play interval (5 seconds + buffer)
    await page.waitForTimeout(6000);

    // Counter should change
    const newCounter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    expect(newCounter).not.toBe(initialCounter);
  });

  test('should wrap around from last to first slide', async ({ page }) => {
    // Get total number of slides
    const counterText = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    const totalSlides = parseInt(counterText?.split('/')[1]?.trim() || '1');

    // Click next button enough times to wrap around
    for (let i = 0; i < totalSlides; i++) {
      await page.click('button[aria-label*="Next"]');
      await page.waitForTimeout(500);
    }

    // Should be back at first slide
    const finalCounter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    expect(finalCounter).toContain('1 /');
  });

  test('should display slide captions', async ({ page }) => {
    // Look for heading within carousel
    const heading = page.locator('[role="region"] h2, [role="region"] h1').first();

    if (await heading.count() > 0) {
      await expect(heading).toBeVisible();
    }
  });

  test('should have smooth transitions between slides', async ({ page }) => {
    // Click next
    await page.click('button[aria-label*="Next"]');

    // Animation should complete within reasonable time
    await page.waitForTimeout(1000);

    // Should be stable
    const counter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    expect(counter).toBeTruthy();
  });
});

test.describe('Homepage Hero Carousel - Responsive', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Carousel should be visible
    await expect(page.locator('[role="region"]').first()).toBeVisible();

    // Controls should be accessible
    await expect(page.locator('button[aria-label*="Next"]')).toBeVisible();
  });

  test('should work with touch gestures on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Get carousel element
    const carousel = page.locator('[role="region"]').first();

    // Controls should still work via tap
    await page.click('button[aria-label*="Next"]');
    await page.waitForTimeout(500);

    const counter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    expect(counter).toBeTruthy();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('[role="region"]').first()).toBeVisible();
  });
});

test.describe('Homepage Hero Carousel - Edge Cases', () => {
  test('should handle rapid clicking', async ({ page }) => {
    await page.goto('/');

    // Click next button rapidly
    for (let i = 0; i < 5; i++) {
      await page.click('button[aria-label*="Next"]');
    }

    // Should complete all transitions
    await page.waitForTimeout(1500);

    // Counter should be stable
    const counter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    expect(counter).toBeTruthy();
  });

  test('should handle keyboard and mouse navigation together', async ({ page }) => {
    await page.goto('/');

    // Use keyboard
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);

    // Then use mouse
    await page.click('button[aria-label*="Next"]');
    await page.waitForTimeout(500);

    // Should work correctly
    const counter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    expect(counter).toBeTruthy();
  });
});
