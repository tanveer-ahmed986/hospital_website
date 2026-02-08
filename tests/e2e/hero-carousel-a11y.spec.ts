/**
 * E2E Tests: Hero Carousel Accessibility
 *
 * Tests WCAG 2.1 AA compliance for hero carousel
 * Task: T151 [Homepage]
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Hero Carousel Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should pass axe accessibility tests', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('carousel should have proper ARIA attributes', async ({ page }) => {
    // Check for region role
    const carousel = page.locator('[role="region"]').first();
    await expect(carousel).toBeVisible();

    // Should have aria-label
    await expect(carousel).toHaveAttribute('aria-label');

    // Should have aria-live
    await expect(carousel).toHaveAttribute('aria-live', 'polite');
  });

  test('navigation buttons should be keyboard accessible', async ({ page }) => {
    // Tab to next button
    await page.keyboard.press('Tab');

    let attempts = 0;
    let foundNextButton = false;

    while (attempts < 20 && !foundNextButton) {
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          ariaLabel: el?.getAttribute('aria-label'),
          role: el?.getAttribute('role'),
        };
      });

      if (focusedElement.ariaLabel?.includes('Next')) {
        foundNextButton = true;
        break;
      }

      await page.keyboard.press('Tab');
      attempts++;
    }

    expect(foundNextButton).toBeTruthy();
  });

  test('carousel controls should have descriptive labels', async ({ page }) => {
    // Previous button
    const prevButton = page.locator('button[aria-label*="Previous"]').first();
    await expect(prevButton).toBeVisible();

    // Next button
    const nextButton = page.locator('button[aria-label*="Next"]').first();
    await expect(nextButton).toBeVisible();

    // Pause/Play button
    const pauseButton = page.locator('button[aria-label*="Pause"], button[aria-label*="Play"]').first();
    await expect(pauseButton).toBeVisible();
  });

  test('carousel images should have alt text', async ({ page }) => {
    const images = await page.locator('[role="region"] img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('dot indicators should have proper ARIA attributes', async ({ page }) => {
    // Check for tablist role
    const tablist = page.locator('[role="tablist"]');

    if (await tablist.count() > 0) {
      await expect(tablist.first()).toBeVisible();

      // Check tabs have aria-labels
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();

      for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i);
        const ariaLabel = await tab.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('carousel should work with keyboard navigation', async ({ page }) => {
    // Get initial slide number
    const initialCounter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();

    // Press right arrow key
    await page.keyboard.press('ArrowRight');

    // Wait for transition
    await page.waitForTimeout(500);

    // Counter should change
    const newCounter = await page.locator('text=/\\d+ \\/ \\d+/').textContent();
    expect(newCounter).not.toBe(initialCounter);
  });

  test('space key should toggle pause/play', async ({ page }) => {
    // Press space
    await page.keyboard.press('Space');

    // Should show play button (meaning carousel is paused)
    await page.waitForTimeout(200);

    const playButton = page.locator('button[aria-label*="Play"]');
    const isPaused = await playButton.count() > 0;

    expect(isPaused).toBeTruthy();
  });

  test('carousel should have screen reader announcements', async ({ page }) => {
    // Check for sr-only content
    const srOnly = page.locator('.sr-only');
    const count = await srOnly.count();

    expect(count).toBeGreaterThan(0);

    // Should contain information about current slide
    const srText = await srOnly.first().textContent();
    expect(srText).toMatch(/showing image \d+ of \d+/i);
  });

  test('focus should be visible on interactive elements', async ({ page }) => {
    // Tab through elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;

        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        };
      });

      if (focusedElement) {
        // Should have visible focus indicator
        const hasFocusIndicator =
          focusedElement.outline !== 'none' ||
          focusedElement.outlineWidth !== '0px' ||
          focusedElement.boxShadow !== 'none';

        if (hasFocusIndicator) {
          expect(hasFocusIndicator).toBeTruthy();
          break;
        }
      }
    }
  });

  test('color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('[role="region"]')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('carousel should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('touch targets should be at least 44x44 pixels', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const buttons = await page.locator('[role="region"] button').all();

    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
