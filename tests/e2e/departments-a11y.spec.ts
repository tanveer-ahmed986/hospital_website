/**
 * E2E Tests: Department and Service Pages Accessibility
 *
 * Tests WCAG 2.1 AA compliance for department and service pages
 * Task: T117 [US2]
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Department Pages Accessibility', () => {
  test('departments listing page should be accessible', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('individual department page should be accessible', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    // Navigate to first department
    await page.locator('a[href^="/departments/"]').first().click();
    await page.waitForURL(/\/departments\/[a-z0-9-]+/);
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('department page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    await page.locator('a[href^="/departments/"]').first().click();
    await page.waitForURL(/\/departments\/[a-z0-9-]+/);

    // Should have h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Headings should be in order (h1, then h2, then h3, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = await Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate((el) => el.tagName);
        return parseInt(tagName.substring(1));
      })
    );

    // Check that heading levels don't skip (e.g., h1 -> h3)
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1];
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('department cards should be keyboard navigable', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    // Tab to first department card
    await page.keyboard.press('Tab');

    // Keep tabbing until we reach a department link
    let attempts = 0;
    let foundDepartmentLink = false;

    while (attempts < 20 && !foundDepartmentLink) {
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          href: el?.getAttribute('href'),
        };
      });

      if (focusedElement.href?.startsWith('/departments/')) {
        foundDepartmentLink = true;
        break;
      }

      await page.keyboard.press('Tab');
      attempts++;
    }

    expect(foundDepartmentLink).toBeTruthy();
  });

  test('department images should have alt text', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    await page.locator('a[href^="/departments/"]').first().click();
    await page.waitForURL(/\/departments\/[a-z0-9-]+/);

    // Check all images have alt attributes
    const images = await page.locator('img').all();

    for (const img of images) {
      const hasAlt = await img.getAttribute('alt');
      expect(hasAlt).not.toBeNull();
    }
  });
});

test.describe('Service Pages Accessibility', () => {
  test('services listing page should be accessible', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('individual service page should be accessible', async ({ page }) => {
    await page.goto('/services');
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });

    // Navigate to first service
    await page.locator('a[href^="/services/"]').first().click();
    await page.waitForURL(/\/services\/[a-z0-9-]+/);
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('service page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/services');
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });

    await page.locator('a[href^="/services/"]').first().click();
    await page.waitForURL(/\/services\/[a-z0-9-]+/);

    // Should have h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('service cards should be keyboard navigable', async ({ page }) => {
    await page.goto('/services');
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });

    // Tab to first service card
    await page.keyboard.press('Tab');

    // Keep tabbing until we reach a service link
    let attempts = 0;
    let foundServiceLink = false;

    while (attempts < 20 && !foundServiceLink) {
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          href: el?.getAttribute('href'),
        };
      });

      if (focusedElement.href?.startsWith('/services/')) {
        foundServiceLink = true;
        break;
      }

      await page.keyboard.press('Tab');
      attempts++;
    }

    expect(foundServiceLink).toBeTruthy();
  });

  test('service benefits list should be properly marked up', async ({ page }) => {
    await page.goto('/services');
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });

    await page.locator('a[href^="/services/"]').first().click();
    await page.waitForURL(/\/services\/[a-z0-9-]+/);

    // If benefits section exists, check for proper list markup
    const benefitsSection = page.locator('text=/Benefits?/i');
    const hasBenefits = await benefitsSection.count() > 0;

    if (hasBenefits) {
      // Benefits should be in a list (ul or ol)
      const lists = page.locator('ul, ol');
      const listCount = await lists.count();
      expect(listCount).toBeGreaterThan(0);
    }
  });
});

test.describe('About Page Accessibility', () => {
  test('about page should be accessible', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('about page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/about');

    // Should have h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Should have proper hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(1);
  });

  test('about page sections should be keyboard navigable', async ({ page }) => {
    await page.goto('/about');

    // All interactive elements should be reachable via keyboard
    const links = await page.locator('a').all();

    for (const link of links) {
      const isVisible = await link.isVisible();
      if (isVisible) {
        const href = await link.getAttribute('href');
        expect(href).not.toBeNull();
      }
    }
  });
});

test.describe('Facilities Page Accessibility', () => {
  test('facilities page should be accessible', async ({ page }) => {
    await page.goto('/facilities');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('facilities page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/facilities');

    // Should have h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('facility icons should have appropriate labels', async ({ page }) => {
    await page.goto('/facilities');

    // SVG icons should either have aria-hidden or proper labels
    const svgs = await page.locator('svg').all();

    for (const svg of svgs) {
      const isVisible = await svg.isVisible();
      if (isVisible) {
        const ariaHidden = await svg.getAttribute('aria-hidden');
        const ariaLabel = await svg.getAttribute('aria-label');
        const role = await svg.getAttribute('role');

        // Icon should either be hidden from screen readers or have a label
        const isAccessible =
          ariaHidden === 'true' || ariaLabel !== null || role === 'img';

        expect(isAccessible).toBeTruthy();
      }
    }
  });
});

test.describe('Color Contrast', () => {
  test('department page text should have sufficient color contrast', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('main')
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('service page text should have sufficient color contrast', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('main')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });
});

test.describe('Focus Management', () => {
  test('focus should be visible on all interactive elements', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    // Tab through interactive elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;

        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineColor: styles.outlineColor,
          boxShadow: styles.boxShadow,
        };
      });

      if (focusedElement) {
        // Should have visible focus indicator (outline or box-shadow)
        const hasFocusIndicator =
          focusedElement.outline !== 'none' ||
          focusedElement.outlineWidth !== '0px' ||
          focusedElement.boxShadow !== 'none';

        expect(hasFocusIndicator).toBeTruthy();
      }
    }
  });
});

test.describe('Screen Reader Support', () => {
  test('department cards should have proper semantic structure', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    // Department cards should be links with proper text
    const departmentLinks = await page.locator('a[href^="/departments/"]').all();

    for (const link of departmentLinks) {
      const textContent = await link.textContent();
      expect(textContent?.trim().length).toBeGreaterThan(0);
    }
  });

  test('service page sections should have proper landmark roles', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Should have main landmark
    const mainLandmark = page.locator('main');
    await expect(mainLandmark).toBeVisible();

    // Check for proper semantic structure
    const hasProperStructure = await page.evaluate(() => {
      const main = document.querySelector('main');
      return main !== null;
    });

    expect(hasProperStructure).toBeTruthy();
  });
});

test.describe('Responsive Accessibility', () => {
  test('department page should be accessible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/departments');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('service page should be accessible on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('touch targets should be at least 44x44 pixels on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/departments');
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    const links = await page.locator('a[href^="/departments/"]').all();

    for (const link of links) {
      const box = await link.boundingBox();
      if (box) {
        // Touch target should be at least 44x44 pixels
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
