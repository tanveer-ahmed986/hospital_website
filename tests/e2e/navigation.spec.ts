/**
 * E2E Tests for Navigation and Sticky Header
 *
 * Tests navigation functionality, sticky header behavior, and mobile menu.
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header should be visible on page load', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('emergency banner should display emergency contact', async ({ page }) => {
    const emergencyBanner = page.locator('header').first();
    await expect(emergencyBanner).toContainText('Emergency');
  });

  test('hospital logo and name should be visible', async ({ page }) => {
    const logo = page.locator('header img[alt*="logo"]');
    const hospitalName = page.locator('header h1');

    await expect(logo).toBeVisible();
    await expect(hospitalName).toBeVisible();
  });

  test('main navigation links should be present', async ({ page }) => {
    const nav = page.locator('nav[role="navigation"]');

    // Check for key navigation items
    await expect(nav.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('navigation links should be clickable and navigate correctly', async ({ page }) => {
    // Click About link
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about/);

    // Go back and click Contact
    await page.goto('/');
    await page.click('text=Contact');
    await expect(page).toHaveURL(/\/contact/);
  });

  test('dropdown menu should open on hover (desktop)', async ({ page, viewport }) => {
    test.skip(!!(viewport && viewport.width < 1024), 'Desktop only test');

    const doctorsButton = page.locator('nav button:has-text("Doctors")');
    await doctorsButton.hover();

    // Wait for dropdown to appear
    await page.waitForTimeout(100);

    const dropdown = page.locator('nav [aria-haspopup="true"] + div');
    await expect(dropdown).toBeVisible();

    // Check dropdown items
    await expect(dropdown.getByText('Find a Doctor')).toBeVisible();
    await expect(dropdown.getByText('By Specialty')).toBeVisible();
  });

  test('active navigation link should be highlighted', async ({ page }) => {
    await page.goto('/about');

    const aboutLink = page.locator('nav a[href="/about"]');
    const classes = await aboutLink.getAttribute('class');

    // Check if active classes are applied (text color should be primary)
    expect(classes).toContain('text-[var(--color-primary)]');
  });
});

test.describe('Sticky Header Behavior', () => {
  test('header should become sticky with shadow after scrolling', async ({ page }) => {
    await page.goto('/');

    // Get initial header state
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300); // Wait for scroll animation

    // Check if shadow class is applied
    const classes = await header.getAttribute('class');
    expect(classes).toContain('shadow');
  });

  test('header should hide on scroll down and show on scroll up', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');

    // Scroll down significantly
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(400);

    // Header should have translate-y class (hidden)
    let classes = await header.getAttribute('class');
    expect(classes).toContain('-translate-y-full');

    // Scroll up
    await page.evaluate(() => window.scrollBy(0, -400));
    await page.waitForTimeout(400);

    // Header should be visible again
    classes = await header.getAttribute('class');
    expect(classes).toContain('translate-y-0');
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile menu button should be visible', async ({ page }) => {
    await page.goto('/');

    const mobileMenuButton = page.locator('button[aria-label*="navigation menu"]');
    await expect(mobileMenuButton).toBeVisible();
  });

  test('mobile menu should open and close', async ({ page }) => {
    await page.goto('/');

    const mobileMenuButton = page.locator('button[aria-label*="navigation menu"]');

    // Open mobile menu
    await mobileMenuButton.click();
    await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');

    // Check if mobile menu items are visible
    const mobileNav = page.locator('nav .lg\\:hidden');
    await expect(mobileNav.getByText('Home')).toBeVisible();
    await expect(mobileNav.getByText('About')).toBeVisible();

    // Close mobile menu
    await mobileMenuButton.click();
    await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile dropdown should expand and collapse', async ({ page }) => {
    await page.goto('/');

    const mobileMenuButton = page.locator('button[aria-label*="navigation menu"]');
    await mobileMenuButton.click();

    // Find and click dropdown button
    const dropdownButton = page.locator('nav button:has-text("Doctors")').last();
    await dropdownButton.click();

    // Check if dropdown items are visible
    await expect(page.getByText('Find a Doctor')).toBeVisible();
    await expect(page.getByText('By Specialty')).toBeVisible();

    // Collapse dropdown
    await dropdownButton.click();
    await expect(page.getByText('Find a Doctor')).not.toBeVisible();
  });

  test('clicking mobile nav link should close menu', async ({ page }) => {
    await page.goto('/');

    const mobileMenuButton = page.locator('button[aria-label*="navigation menu"]');
    await mobileMenuButton.click();

    // Click a navigation link
    await page.click('nav a[href="/about"]');

    // Menu should close and navigate
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('nav .lg\\:hidden ul')).not.toBeVisible();
  });

  test('mobile menu should show contact information', async ({ page }) => {
    await page.goto('/');

    const mobileMenuButton = page.locator('button[aria-label*="navigation menu"]');
    await mobileMenuButton.click();

    // Check for contact info in mobile menu
    const mobileNav = page.locator('nav .lg\\:hidden');
    await expect(mobileNav.locator('a[href^="tel:"]')).toBeVisible();
    await expect(mobileNav.locator('a[href^="mailto:"]')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('navigation should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });

  test('dropdown buttons should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');

    const dropdownButton = page.locator('nav button[aria-haspopup="true"]').first();
    await expect(dropdownButton).toHaveAttribute('aria-expanded');
  });

  test('mobile menu button should have accessible label', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const mobileMenuButton = page.locator('button[aria-label*="navigation menu"]');
    await expect(mobileMenuButton).toHaveAttribute('aria-label');
    await expect(mobileMenuButton).toHaveAttribute('aria-expanded');
  });

  test('emergency contact links should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const emergencyLink = page.locator('a[href^="tel:"]').first();
    await emergencyLink.focus();
    await expect(emergencyLink).toBeFocused();
  });
});

test.describe('Footer', () => {
  test('footer should contain hospital information', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check for hospital name
    await expect(footer.locator('h3')).toContainText(/hospital/i);

    // Check for contact information
    await expect(footer.locator('a[href^="tel:"]')).toBeVisible();
    await expect(footer.locator('a[href^="mailto:"]')).toBeVisible();
  });

  test('footer should contain navigation links', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');

    // Check for quick links
    await expect(footer.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('footer emergency contact should be prominent', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    const emergencySection = footer.locator('.bg-red-600');

    await expect(emergencySection).toBeVisible();
    await expect(emergencySection).toContainText('Emergency');
  });

  test('footer should display current year in copyright', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    const currentYear = new Date().getFullYear();

    await expect(footer).toContainText(currentYear.toString());
  });
});
