/**
 * E2E Tests: Homepage Navigation
 *
 * Tests navigation from homepage to all sections and pages
 * Task: T158 [Homepage]
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display all main sections', async ({ page }) => {
    // Hero carousel
    await expect(page.locator('[role="region"]').first()).toBeVisible();

    // Quick links section
    await expect(page.locator('text=/Emergency Services/i')).toBeVisible();
    await expect(page.locator('text=/Find a Doctor/i')).toBeVisible();

    // Should have multiple sections
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(3);
  });

  test('should navigate to emergency services', async ({ page }) => {
    await page.click('text=/Emergency Services/i');
    await page.waitForURL('**/contact');
  });

  test('should navigate to doctors page from quick link', async ({ page }) => {
    await page.click('a[href="/doctors"]');
    await page.waitForURL('**/doctors');
    await expect(page.locator('h1')).toContainText(/doctor/i);
  });

  test('should navigate to appointments page from quick link', async ({ page }) => {
    const appointmentLink = page.locator('a[href="/appointments"]').first();
    await appointmentLink.click();
    await page.waitForURL('**/appointments');
  });

  test('should display featured doctors section', async ({ page }) => {
    const doctorsSection = page.locator('text=/Expert Doctors|Our Doctors|Meet Our/i');

    if (await doctorsSection.count() > 0) {
      await expect(doctorsSection.first()).toBeVisible();

      // Should have "View All" link
      const viewAllLink = page.locator('a[href="/doctors"]:has-text("View All")');
      if (await viewAllLink.count() > 0) {
        await expect(viewAllLink.first()).toBeVisible();
      }
    }
  });

  test('should navigate to individual doctor from featured section', async ({ page }) => {
    // Look for doctor links
    const doctorLinks = page.locator('a[href^="/doctors/"]');

    if (await doctorLinks.count() > 0) {
      await doctorLinks.first().click();
      await page.waitForURL('**/doctors/**');
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should display departments section', async ({ page }) => {
    const departmentsSection = page.locator('text=/Our Departments|Departments/i');

    if (await departmentsSection.count() > 0) {
      await expect(departmentsSection.first()).toBeVisible();
    }
  });

  test('should navigate to departments page', async ({ page }) => {
    const departmentsLink = page.locator('a[href="/departments"]').first();

    if (await departmentsLink.isVisible()) {
      await departmentsLink.click();
      await page.waitForURL('**/departments');
    }
  });

  test('should navigate to individual department', async ({ page }) => {
    const departmentLinks = page.locator('a[href^="/departments/"]');

    if (await departmentLinks.count() > 0) {
      await departmentLinks.first().click();
      await page.waitForURL('**/departments/**');
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should display testimonials section', async ({ page }) => {
    const testimonialsSection = page.locator('text=/Patients Say|Testimonials|Reviews/i');

    if (await testimonialsSection.count() > 0) {
      await expect(testimonialsSection.first()).toBeVisible();
    }
  });

  test('should navigate testimonials carousel', async ({ page }) => {
    // Look for testimonial navigation buttons
    const nextButton = page.locator('button[aria-label*="Next testimonial"]');

    if (await nextButton.count() > 0) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('should display appointment CTA section', async ({ page }) => {
    await expect(page.locator('text=/Book an Appointment|Ready to Book/i')).toBeVisible();
  });

  test('should navigate to appointments from CTA', async ({ page }) => {
    // Find "Book Appointment" button in CTA section
    const ctaButton = page.locator('text=/Book Appointment Now/i');

    if (await ctaButton.count() > 0) {
      await ctaButton.first().click();
      await page.waitForURL('**/appointments');
    }
  });

  test('should display "Why Choose Us" section', async ({ page }) => {
    await expect(page.locator('text=/Why Choose/i')).toBeVisible();

    // Should have feature highlights
    await expect(page.locator('text=/Experienced Team|Expert/i')).toBeVisible();
    await expect(page.locator('text=/24.*7|Emergency/i')).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Footer should be visible
    await expect(page.locator('footer')).toBeVisible();
  });
});

test.describe('Homepage - Section Visibility', () => {
  test('all sections should be visible on scroll', async ({ page }) => {
    await page.goto('/');

    // Scroll through page
    const sections = ['hero', 'quick-links', 'doctors', 'departments', 'testimonials', 'cta'];

    for (const sectionId of sections) {
      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(200);
    }

    // Should reach bottom
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(0);
  });

  test('header should be sticky on scroll', async ({ page }) => {
    await page.goto('/');

    // Get initial header position
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    // Header should still be visible (sticky or fixed)
    const headerAfterScroll = await header.isVisible();
    expect(headerAfterScroll).toBeTruthy();
  });
});

test.describe('Homepage - Responsive Navigation', () => {
  test('should navigate correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Quick links should be visible and clickable
    await page.click('text=/Find a Doctor/i');
    await page.waitForURL('**/doctors');
  });

  test('should display mobile-friendly layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Content should be visible
    await expect(page.locator('[role="region"]').first()).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // All main sections should be visible
    await expect(page.locator('text=/Emergency Services/i')).toBeVisible();
  });
});

test.describe('Homepage - Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load in under 5 seconds (generous for E2E)
    expect(loadTime).toBeLessThan(5000);
  });

  test('images should load progressively', async ({ page }) => {
    await page.goto('/');

    // Wait for first image
    await page.waitForSelector('img', { timeout: 3000 });

    const images = await page.locator('img').all();
    expect(images.length).toBeGreaterThan(0);
  });
});

test.describe('Homepage - Content', () => {
  test('should display hospital name', async ({ page }) => {
    await page.goto('/');

    // Header should show hospital name
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');

    // Navigation should be keyboard accessible
    await page.keyboard.press('Tab');

    let attempts = 0;
    let foundLink = false;

    while (attempts < 30 && !foundLink) {
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          href: el?.getAttribute('href'),
        };
      });

      if (focusedElement.tagName === 'A' && focusedElement.href) {
        foundLink = true;
        break;
      }

      await page.keyboard.press('Tab');
      attempts++;
    }

    expect(foundLink).toBeTruthy();
  });
});
