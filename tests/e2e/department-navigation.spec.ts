/**
 * E2E Tests: Department and Service Navigation
 *
 * Tests complete user journey through departments and services
 * Task: T116 [US2]
 */

import { test, expect } from '@playwright/test';

test.describe('Department Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/');
  });

  test('should navigate to departments page from navigation menu', async ({ page }) => {
    // Click on Departments link in navigation
    await page.click('text=Departments');
    await expect(page).toHaveURL('/departments');

    // Verify page loaded
    await expect(page.locator('h1')).toContainText(/Departments|Our Departments/i);
  });

  test('should display all department cards on listing page', async ({ page }) => {
    await page.goto('/departments');

    // Wait for content to load
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    // Should have at least one department card
    const departmentCards = page.locator('a[href^="/departments/"]');
    await expect(departmentCards.first()).toBeVisible();

    // Each card should have a name
    const firstCard = departmentCards.first();
    await expect(firstCard.locator('h3, h2')).toBeVisible();
  });

  test('should navigate to individual department page', async ({ page }) => {
    await page.goto('/departments');

    // Click on first department card
    const firstDepartment = page.locator('a[href^="/departments/"]').first();
    const departmentName = await firstDepartment.locator('h3, h2').first().textContent();

    await firstDepartment.click();

    // Should navigate to department detail page
    await expect(page).toHaveURL(/\/departments\/[a-z0-9-]+/);

    // Page should display department name
    await expect(page.locator('h1')).toContainText(departmentName || '');
  });

  test('should display department information on detail page', async ({ page }) => {
    await page.goto('/departments');

    // Navigate to first department
    await page.locator('a[href^="/departments/"]').first().click();
    await page.waitForURL(/\/departments\/[a-z0-9-]+/);

    // Should have department name
    await expect(page.locator('h1')).toBeVisible();

    // Should have description or content
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('should show doctors section if department has doctors', async ({ page }) => {
    await page.goto('/departments');
    await page.locator('a[href^="/departments/"]').first().click();
    await page.waitForURL(/\/departments\/[a-z0-9-]+/);

    // Look for doctors section (may or may not exist)
    const doctorsSection = page.locator('text=/Specialist Doctors?/i');
    const hasDoctors = await doctorsSection.count() > 0;

    if (hasDoctors) {
      // If doctors section exists, should have doctor cards
      const doctorCards = page.locator('a[href^="/doctors/"]');
      await expect(doctorCards.first()).toBeVisible();
    }
  });

  test('should show services section if department has services', async ({ page }) => {
    await page.goto('/departments');
    await page.locator('a[href^="/departments/"]').first().click();
    await page.waitForURL(/\/departments\/[a-z0-9-]+/);

    // Look for services section
    const servicesSection = page.locator('text=/Services? Offered/i');
    const hasServices = await servicesSection.count() > 0;

    if (hasServices) {
      // If services section exists, should have service cards
      await expect(servicesSection).toBeVisible();
    }
  });

  test('should have "Book Appointment" CTA on department page', async ({ page }) => {
    await page.goto('/departments');
    await page.locator('a[href^="/departments/"]').first().click();
    await page.waitForURL(/\/departments\/[a-z0-9-]+/);

    // Should have appointment CTA
    const appointmentLink = page.locator('a[href="/appointments"]');
    await expect(appointmentLink.first()).toBeVisible();
  });
});

test.describe('Service Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to services page from navigation menu', async ({ page }) => {
    await page.click('text=Services');
    await expect(page).toHaveURL('/services');

    // Verify page loaded
    await expect(page.locator('h1')).toContainText(/Services|Medical Services/i);
  });

  test('should display service categories on listing page', async ({ page }) => {
    await page.goto('/services');

    // Wait for content to load
    await page.waitForSelector('main', { timeout: 10000 });

    // Should have category headers or service cards
    const hasCategories = (await page.locator('h2').count()) > 1;
    const hasServiceCards = (await page.locator('a[href^="/services/"]').count()) > 0;

    expect(hasCategories || hasServiceCards).toBeTruthy();
  });

  test('should navigate to individual service page', async ({ page }) => {
    await page.goto('/services');

    // Wait for service links
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });

    // Click on first service
    const firstService = page.locator('a[href^="/services/"]').first();
    await firstService.click();

    // Should navigate to service detail page
    await expect(page).toHaveURL(/\/services\/[a-z0-9-]+/);

    // Page should have main content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display service information on detail page', async ({ page }) => {
    await page.goto('/services');
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });

    // Navigate to first service
    await page.locator('a[href^="/services/"]').first().click();
    await page.waitForURL(/\/services\/[a-z0-9-]+/);

    // Should have service name
    await expect(page.locator('h1')).toBeVisible();

    // Should have some content
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should show benefits section if available', async ({ page }) => {
    await page.goto('/services');
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });
    await page.locator('a[href^="/services/"]').first().click();
    await page.waitForURL(/\/services\/[a-z0-9-]+/);

    // Look for benefits section
    const benefitsHeading = page.locator('text=/Benefits?/i');
    const hasBenefits = await benefitsHeading.count() > 0;

    if (hasBenefits) {
      await expect(benefitsHeading.first()).toBeVisible();
    }
  });

  test('should have "Book Appointment" CTA on service page', async ({ page }) => {
    await page.goto('/services');
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });
    await page.locator('a[href^="/services/"]').first().click();
    await page.waitForURL(/\/services\/[a-z0-9-]+/);

    // Should have appointment CTA
    const appointmentLink = page.locator('a[href="/appointments"]');
    await expect(appointmentLink.first()).toBeVisible();
  });

  test('should show related department link if available', async ({ page }) => {
    await page.goto('/services');
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });
    await page.locator('a[href^="/services/"]').first().click();
    await page.waitForURL(/\/services\/[a-z0-9-]+/);

    // Look for department link
    const departmentLinks = page.locator('a[href^="/departments/"]');
    const hasDepartmentLink = await departmentLinks.count() > 0;

    if (hasDepartmentLink) {
      await expect(departmentLinks.first()).toBeVisible();
    }
  });
});

test.describe('About and Facilities Pages', () => {
  test('should display About page', async ({ page }) => {
    await page.goto('/about');

    // Should have heading
    await expect(page.locator('h1')).toContainText(/About/i);

    // Should have mission/vision/values or similar content
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('should display mission, vision, and values on About page', async ({ page }) => {
    await page.goto('/about');

    // Look for mission/vision/values sections
    const hasMission = await page.locator('text=/Mission/i').count() > 0;
    const hasVision = await page.locator('text=/Vision/i').count() > 0;
    const hasValues = await page.locator('text=/Values/i').count() > 0;

    // At least one of these should be present
    expect(hasMission || hasVision || hasValues).toBeTruthy();
  });

  test('should display Facilities page', async ({ page }) => {
    await page.goto('/facilities');

    // Should have heading
    await expect(page.locator('h1')).toContainText(/Facilities/i);

    // Should have facility content
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('should display multiple facilities on Facilities page', async ({ page }) => {
    await page.goto('/facilities');

    // Should have multiple facility cards/items
    const facilityItems = page.locator('h3, .facility, [class*="facility"]');
    const count = await facilityItems.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should have "Book Appointment" CTA on About page', async ({ page }) => {
    await page.goto('/about');

    const appointmentLink = page.locator('a[href="/appointments"]');
    await expect(appointmentLink.first()).toBeVisible();
  });

  test('should have "Book Appointment" CTA on Facilities page', async ({ page }) => {
    await page.goto('/facilities');

    const appointmentLink = page.locator('a[href="/appointments"]');
    await expect(appointmentLink.first()).toBeVisible();
  });
});

test.describe('Cross-Navigation', () => {
  test('should navigate from department to service', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    // Go to department
    await page.locator('a[href^="/departments/"]').first().click();
    await page.waitForURL(/\/departments\/[a-z0-9-]+/);

    // Look for service links
    const serviceLinks = page.locator('a[href^="/services/"]');
    const hasServiceLinks = await serviceLinks.count() > 0;

    if (hasServiceLinks) {
      await serviceLinks.first().click();
      await expect(page).toHaveURL(/\/services\/[a-z0-9-]+/);
    }
  });

  test('should navigate from service to department', async ({ page }) => {
    await page.goto('/services');
    await page.waitForSelector('a[href^="/services/"]', { timeout: 10000 });

    // Go to service
    await page.locator('a[href^="/services/"]').first().click();
    await page.waitForURL(/\/services\/[a-z0-9-]+/);

    // Look for department links
    const departmentLinks = page.locator('a[href^="/departments/"]');
    const hasDepartmentLinks = await departmentLinks.count() > 0;

    if (hasDepartmentLinks) {
      await departmentLinks.first().click();
      await expect(page).toHaveURL(/\/departments\/[a-z0-9-]+/);
    }
  });

  test('should navigate from department to doctor profile', async ({ page }) => {
    await page.goto('/departments');
    await page.waitForSelector('a[href^="/departments/"]', { timeout: 10000 });

    // Go to department
    await page.locator('a[href^="/departments/"]').first().click();
    await page.waitForURL(/\/departments\/[a-z0-9-]+/);

    // Look for doctor links
    const doctorLinks = page.locator('a[href^="/doctors/"]');
    const hasDoctorLinks = await doctorLinks.count() > 0;

    if (hasDoctorLinks) {
      await doctorLinks.first().click();
      await expect(page).toHaveURL(/\/doctors\/[a-z0-9-]+/);
    }
  });
});

test.describe('Search and Filter (if implemented)', () => {
  test('should handle empty state gracefully', async ({ page }) => {
    await page.goto('/departments');

    // Page should load without errors
    await expect(page.locator('main')).toBeVisible();
  });

  test('should handle direct URL access to non-existent department', async ({ page }) => {
    await page.goto('/departments/non-existent-department-slug-12345');

    // Should show 404 or error message
    const is404 = await page.locator('text=/Not Found|404/i').count() > 0;
    const hasError = await page.locator('text=/error/i').count() > 0;

    expect(is404 || hasError).toBeTruthy();
  });

  test('should handle direct URL access to non-existent service', async ({ page }) => {
    await page.goto('/services/non-existent-service-slug-12345');

    // Should show 404 or error message
    const is404 = await page.locator('text=/Not Found|404/i').count() > 0;
    const hasError = await page.locator('text=/error/i').count() > 0;

    expect(is404 || hasError).toBeTruthy();
  });
});
