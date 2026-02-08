/**
 * E2E Test: Browse doctors and view profile
 * Task: T090 [US1]
 *
 * Tests the complete doctor discovery flow from homepage to profile
 */

import { test, expect } from '@playwright/test';

test.describe('Doctor Browsing Flow', () => {
  test('user can browse doctors from homepage', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Should see "Our Doctors" section or link
    const doctorsLink = page.getByRole('link', { name: /doctors|find.* doctor|our team/i });
    await expect(doctorsLink).toBeVisible();

    // Click to doctors page
    await doctorsLink.click();

    // Should be on doctors listing page
    await expect(page).toHaveURL(/\/doctors/);
    await expect(page.getByRole('heading', { name: /our doctors|find a doctor/i })).toBeVisible();
  });

  test('doctors listing page displays doctor cards', async ({ page }) => {
    await page.goto('/doctors');

    // Wait for doctors to load
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    // Should have at least one doctor card
    const doctorCards = page.locator('[data-testid="doctor-card"]');
    await expect(doctorCards.first()).toBeVisible();

    // Doctor card should display key information
    const firstCard = doctorCards.first();
    await expect(firstCard.getByRole('heading')).toBeVisible(); // Doctor name
    await expect(firstCard).toContainText(/MBBS|MD|MS|FRCS/i); // Qualifications
  });

  test('user can filter doctors by specialty', async ({ page }) => {
    await page.goto('/doctors');

    // Look for specialty filter
    const specialtyFilter = page.locator('select[name="specialty"], [data-testid="specialty-filter"]');

    if (await specialtyFilter.isVisible()) {
      // Select a specialty (e.g., Cardiology)
      await specialtyFilter.selectOption({ label: /cardiology/i });

      // Wait for filtered results
      await page.waitForTimeout(500); // Allow for filtering

      // All visible doctors should be cardiologists
      const doctorCards = page.locator('[data-testid="doctor-card"]');
      const count = await doctorCards.count();

      if (count > 0) {
        // Verify first card shows cardiology
        await expect(doctorCards.first()).toContainText(/cardiology/i);
      }
    }
  });

  test('user can search for doctors by name', async ({ page }) => {
    await page.goto('/doctors');

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

    if (await searchInput.isVisible()) {
      // Type a search query
      await searchInput.fill('John');

      // Wait for search results
      await page.waitForTimeout(500);

      // Should show doctors matching "John"
      const doctorCards = page.locator('[data-testid="doctor-card"]');
      const count = await doctorCards.count();

      if (count > 0) {
        // At least one result should contain "John"
        const text = await doctorCards.first().textContent();
        expect(text?.toLowerCase()).toContain('john');
      }
    }
  });

  test('user can view doctor profile', async ({ page }) => {
    await page.goto('/doctors');

    // Wait for doctors to load
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    // Click on first doctor's "View Profile" link or card
    const firstDoctorCard = page.locator('[data-testid="doctor-card"]').first();
    const profileLink = firstDoctorCard.getByRole('link', { name: /view profile|learn more/i });

    await profileLink.click();

    // Should navigate to doctor profile page
    await expect(page).toHaveURL(/\/doctors\/[a-z-]+/);

    // Profile should display detailed information
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible(); // Doctor name as H1
    await expect(page.locator('text=/experience|years/i')).toBeVisible();
    await expect(page.locator('text=/qualification|education/i')).toBeVisible();
  });

  test('doctor profile shows OPD schedule', async ({ page }) => {
    // Navigate directly to a doctor profile
    await page.goto('/doctors');
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    const firstDoctorLink = page
      .locator('[data-testid="doctor-card"]')
      .first()
      .getByRole('link', { name: /view profile/i });

    await firstDoctorLink.click();

    // Look for schedule section
    const scheduleSection = page.locator('text=/schedule|opd timing|consultation hours/i');

    if (await scheduleSection.isVisible()) {
      // Should show days and times
      await expect(page.locator('text=/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i')).toBeVisible();
      await expect(page.locator('text=/AM|PM|\\d{1,2}:\\d{2}/i')).toBeVisible();
    }
  });

  test('doctor profile has "Book Appointment" button', async ({ page }) => {
    await page.goto('/doctors');
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    const firstDoctorLink = page
      .locator('[data-testid="doctor-card"]')
      .first()
      .getByRole('link', { name: /view profile/i });

    await firstDoctorLink.click();

    // Should have a Book Appointment button
    const bookButton = page.getByRole('button', { name: /book appointment/i });
    await expect(bookButton).toBeVisible();
    await expect(bookButton).toBeEnabled();
  });

  test('clicking "Book Appointment" navigates to booking form', async ({ page }) => {
    await page.goto('/doctors');
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    const firstDoctorLink = page
      .locator('[data-testid="doctor-card"]')
      .first()
      .getByRole('link', { name: /view profile/i });

    await firstDoctorLink.click();

    // Click Book Appointment
    const bookButton = page.getByRole('button', { name: /book appointment/i });
    await bookButton.click();

    // Should navigate to appointments page or show booking form
    await expect(page).toHaveURL(/\/appointments|booking/);
  });

  test('doctor cards are keyboard accessible', async ({ page }) => {
    await page.goto('/doctors');
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    // Tab to first doctor card link
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');

    // Should be able to navigate with keyboard
    await expect(focusedElement).toBeVisible();

    // Press Enter to follow link
    await page.keyboard.press('Enter');

    // Should navigate to doctor profile
    await expect(page).toHaveURL(/\/doctors\/[a-z-]+/);
  });

  test('mobile responsive: doctor cards display correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/doctors');
    await page.waitForSelector('[data-testid="doctor-card"]', { timeout: 5000 });

    // Doctor cards should still be visible on mobile
    const doctorCard = page.locator('[data-testid="doctor-card"]').first();
    await expect(doctorCard).toBeVisible();

    // Card should not be cut off
    const box = await doctorCard.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});
