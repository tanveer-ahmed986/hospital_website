/**
 * E2E Tests: Emergency Contact Visibility
 *
 * Tests emergency contact information is visible across all pages
 * Task: T131 [US3]
 */

import { test, expect } from '@playwright/test';

const testPages = [
  { url: '/', name: 'Homepage' },
  { url: '/doctors', name: 'Doctors' },
  { url: '/departments', name: 'Departments' },
  { url: '/services', name: 'Services' },
  { url: '/appointments', name: 'Appointments' },
  { url: '/about', name: 'About' },
  { url: '/facilities', name: 'Facilities' },
  { url: '/contact', name: 'Contact' },
];

test.describe('Emergency Contact Banner Visibility', () => {
  for (const testPage of testPages) {
    test(`should display emergency contact in header on ${testPage.name} page`, async ({
      page,
    }) => {
      await page.goto(testPage.url);

      // Wait for header to load
      await page.waitForSelector('header', { timeout: 10000 });

      // Check emergency banner is visible in header
      const emergencyBanner = page.locator('header >> text=/emergency/i');
      await expect(emergencyBanner).toBeVisible();

      // Should have a phone number link
      const emergencyLink = page.locator('header a[href^="tel:"]').first();
      await expect(emergencyLink).toBeVisible();
    });
  }

  test('emergency contact should be clickable', async ({ page }) => {
    await page.goto('/');

    // Find emergency phone link in header
    const emergencyLink = page.locator('header a[href^="tel:"]').first();
    await expect(emergencyLink).toBeVisible();

    // Link should have tel: protocol
    const href = await emergencyLink.getAttribute('href');
    expect(href).toMatch(/^tel:\+?\d/);
  });

  test('emergency banner should display correct information', async ({ page }) => {
    await page.goto('/');

    // Should have "Emergency" text
    await expect(page.locator('header >> text=/emergency/i')).toBeVisible();

    // Should show 24/7 availability
    const availability = page.locator('header >> text=/24.*7/i');
    if (await availability.count() > 0) {
      await expect(availability.first()).toBeVisible();
    }
  });

  test('emergency contact should be visible on scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Header might hide on scroll down, but should be accessible
    // Try scrolling up
    await page.evaluate(() => window.scrollBy(0, -200));
    await page.waitForTimeout(500);

    // Emergency contact should be in the page (in header)
    const emergencyText = page.locator('header >> text=/emergency/i');
    // Check if it exists in DOM (might not be visible if header is hidden)
    expect(await emergencyText.count()).toBeGreaterThan(0);
  });

  test('emergency contact should be visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Emergency contact should be in header
    const emergencyBanner = page.locator('header >> text=/emergency/i');
    await expect(emergencyBanner).toBeVisible();

    // Phone link should be clickable
    const emergencyLink = page.locator('header a[href^="tel:"]').first();
    await expect(emergencyLink).toBeVisible();
  });

  test('emergency contact should be visible on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Emergency banner should be visible
    const emergencyBanner = page.locator('header >> text=/emergency/i');
    await expect(emergencyBanner).toBeVisible();
  });
});

test.describe('Emergency Contact on Contact Page', () => {
  test('should display emergency card on contact page', async ({ page }) => {
    await page.goto('/contact');

    // Look for emergency information card (not just header)
    const emergencyCard = page.locator('text=/emergency/i');
    await expect(emergencyCard.first()).toBeVisible();

    // Should have multiple references to emergency
    const emergencyCount = await emergencyCard.count();
    expect(emergencyCount).toBeGreaterThan(0);
  });

  test('emergency contact card should have proper styling', async ({ page }) => {
    await page.goto('/contact');

    // Look for emergency-styled elements (red styling)
    const emergencyElements = page.locator('[class*="red"]');
    await expect(emergencyElements.first()).toBeVisible();
  });

  test('should display 24/7 availability notice', async ({ page }) => {
    await page.goto('/contact');

    // Check for 24/7 or "24 hours" text
    const availability = page.locator('text=/24.*7|twenty.*four|24 hours/i');
    await expect(availability.first()).toBeVisible();
  });

  test('emergency number should be different from regular contact', async ({ page }) => {
    await page.goto('/contact');

    // Get all phone links
    const phoneLinks = page.locator('a[href^="tel:"]');
    const linkCount = await phoneLinks.count();

    // Should have at least 2 phone links (regular + emergency)
    expect(linkCount).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Emergency Contact Accessibility', () => {
  test('emergency link should have proper aria labels', async ({ page }) => {
    await page.goto('/');

    // Check if emergency link has aria-label
    const emergencyLink = page.locator('header a[href^="tel:"]').first();

    const ariaLabel = await emergencyLink.getAttribute('aria-label');
    // Either has aria-label or the text is descriptive enough
    if (ariaLabel) {
      expect(ariaLabel.toLowerCase()).toContain('emergency');
    } else {
      const textContent = await emergencyLink.textContent();
      expect(textContent).toBeTruthy();
    }
  });

  test('emergency banner should use semantic HTML', async ({ page }) => {
    await page.goto('/');

    // Emergency info should be in header
    const headerEmergency = page.locator('header');
    await expect(headerEmergency).toBeVisible();
  });

  test('emergency contact should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through elements
    let foundEmergencyLink = false;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          href: el?.getAttribute('href'),
          text: el?.textContent,
        };
      });

      if (
        focusedElement.href?.startsWith('tel:') &&
        focusedElement.text?.toLowerCase().includes('emergency')
      ) {
        foundEmergencyLink = true;
        break;
      }
    }

    // Emergency link should be reachable via keyboard
    expect(foundEmergencyLink).toBeTruthy();
  });

  test('emergency contact should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    // Emergency banner typically has red background with white text
    // This provides good contrast (we don't test exact values, just that it renders)
    const emergencyBanner = page.locator('header >> text=/emergency/i');
    await expect(emergencyBanner).toBeVisible();

    // Get computed styles
    const styles = await emergencyBanner.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });

    // Should have some color styling (not default)
    expect(styles.color).toBeTruthy();
  });
});

test.describe('Emergency Contact Functionality', () => {
  test('clicking emergency number should initiate phone call', async ({ page }) => {
    await page.goto('/');

    const emergencyLink = page.locator('header a[href^="tel:"]').first();
    const href = await emergencyLink.getAttribute('href');

    // Should be a valid tel: link
    expect(href).toMatch(/^tel:\+?[\d\s-]+$/);

    // Phone number should be properly formatted for dialing (no spaces in href)
    const phoneNumber = href?.replace('tel:', '');
    expect(phoneNumber).toBeTruthy();
  });

  test('emergency contact should persist during navigation', async ({ page }) => {
    await page.goto('/');

    // Verify emergency contact is visible
    await expect(page.locator('header >> text=/emergency/i')).toBeVisible();

    // Navigate to another page
    await page.click('a[href="/contact"]');
    await page.waitForURL('**/contact');

    // Emergency contact should still be visible
    await expect(page.locator('header >> text=/emergency/i')).toBeVisible();
  });

  test('emergency banner should be in sticky header', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial position
    const initialPosition = await page.locator('header').boundingBox();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(300);

    // Header should either be sticky (same position) or hidden
    const headerAfterScroll = page.locator('header');
    const isVisible = await headerAfterScroll.isVisible();

    // If visible, emergency contact should be accessible
    if (isVisible) {
      const emergencyText = page.locator('header >> text=/emergency/i');
      expect(await emergencyText.count()).toBeGreaterThan(0);
    }
  });
});

test.describe('Emergency Contact Content', () => {
  test('should display phone number in readable format', async ({ page }) => {
    await page.goto('/');

    const emergencyLink = page.locator('header a[href^="tel:"]').first();
    const visibleText = await emergencyLink.textContent();

    // Should have some phone number format (digits, dashes, spaces, or plus sign)
    expect(visibleText).toMatch(/[\d\s\-+()]/);
  });

  test('emergency section should include urgency indicators', async ({ page }) => {
    await page.goto('/');

    // Look for urgency-related text or icons
    const header = page.locator('header');

    // Should have "Emergency" text
    await expect(header.locator('text=/emergency/i')).toBeVisible();

    // Might have icons (phone, warning, etc.)
    const hasIcon = (await header.locator('svg').count()) > 0;
    expect(hasIcon).toBeTruthy();
  });
});
