/**
 * Accessibility Tests using axe-core and Playwright
 *
 * Tests WCAG 2.1 Level AA compliance for all critical pages.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('Homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Doctors listing page should not have accessibility violations', async ({ page }) => {
    await page.goto('/doctors');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Appointment booking page should not have accessibility violations', async ({
    page,
  }) => {
    await page.goto('/appointments');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Contact page should not have accessibility violations', async ({ page }) => {
    await page.goto('/contact');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Specialties page should not have accessibility violations', async ({ page }) => {
    await page.goto('/specialties');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Services page should not have accessibility violations', async ({ page }) => {
    await page.goto('/services');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Keyboard navigation should work on homepage', async ({ page }) => {
    await page.goto('/');

    // Test Tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);

    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('All images should have alt text', async ({ page }) => {
    await page.goto('/');

    const imagesWithoutAlt = await page.$$eval('img:not([alt])', (imgs) => imgs.length);

    expect(imagesWithoutAlt).toBe(0);
  });

  test('All buttons should have accessible names', async ({ page }) => {
    await page.goto('/');

    const buttonsWithoutText = await page.$$eval(
      'button:not([aria-label]):not([aria-labelledby])',
      (buttons) =>
        buttons.filter((btn) => !btn.textContent || btn.textContent.trim() === '').length
    );

    expect(buttonsWithoutText).toBe(0);
  });

  test('Form inputs should have associated labels', async ({ page }) => {
    await page.goto('/appointments');

    const inputsWithoutLabels = await page.$$eval(
      'input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])',
      (inputs) =>
        inputs.filter((input) => {
          const id = input.getAttribute('id');
          if (!id) return true;
          const label = document.querySelector(`label[for="${id}"]`);
          return !label;
        }).length
    );

    expect(inputsWithoutLabels).toBe(0);
  });
});
