/**
 * Unit Tests for Hospital Configuration Loader
 *
 * Tests configuration loading, validation, and error handling.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  loadHospitalConfig,
  getCurrentHospitalConfig,
  getAvailableHospitals,
  generateThemeCSS,
  type HospitalConfig,
} from '@/lib/config';

describe('Hospital Configuration Loader', () => {
  describe('loadHospitalConfig', () => {
    it('should load valid hospital configuration', () => {
      const config = loadHospitalConfig('abc-general');

      expect(config).toBeDefined();
      expect(config.hospital.id).toBe('abc-general');
      expect(config.hospital.name).toBe('ABC General Hospital');
    });

    it('should throw error for non-existent hospital', () => {
      expect(() => loadHospitalConfig('non-existent-hospital')).toThrow(
        /Configuration file not found/
      );
    });

    it('should validate hospital configuration schema', () => {
      const config = loadHospitalConfig('abc-general');

      // Hospital info
      expect(config.hospital).toHaveProperty('id');
      expect(config.hospital).toHaveProperty('name');
      expect(config.hospital).toHaveProperty('tagline');
      expect(config.hospital).toHaveProperty('logo');
      expect(config.hospital).toHaveProperty('favicon');
      expect(config.hospital).toHaveProperty('domain');

      // Branding
      expect(config.branding).toHaveProperty('colors');
      expect(config.branding.colors).toHaveProperty('primary');
      expect(config.branding.colors).toHaveProperty('secondary');
      expect(config.branding.colors).toHaveProperty('accent');

      // Contact
      expect(config.contact).toHaveProperty('phone');
      expect(config.contact).toHaveProperty('emergency');
      expect(config.contact).toHaveProperty('email');
      expect(config.contact).toHaveProperty('address');

      // Features
      expect(config.features).toHaveProperty('appointmentBooking');
      expect(config.features).toHaveProperty('patientPortal');

      // Integrations
      expect(config.integrations).toHaveProperty('hms');
      expect(config.integrations).toHaveProperty('sms');
      expect(config.integrations).toHaveProperty('email');
    });

    it('should validate hex color codes', () => {
      const config = loadHospitalConfig('abc-general');

      expect(config.branding.colors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(config.branding.colors.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(config.branding.colors.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should validate email addresses', () => {
      const config = loadHospitalConfig('abc-general');

      expect(config.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(config.integrations.email.from).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  describe('getCurrentHospitalConfig', () => {
    it('should load config based on HOSPITAL_ID environment variable', () => {
      process.env.HOSPITAL_ID = 'abc-general';
      const config = getCurrentHospitalConfig();

      expect(config.hospital.id).toBe('abc-general');
    });

    it('should fallback to abc-general if HOSPITAL_ID not set', () => {
      delete process.env.HOSPITAL_ID;
      const config = getCurrentHospitalConfig();

      expect(config.hospital.id).toBe('abc-general');
    });
  });

  describe('getAvailableHospitals', () => {
    it('should return list of available hospital configurations', () => {
      const hospitals = getAvailableHospitals();

      expect(Array.isArray(hospitals)).toBe(true);
      expect(hospitals.length).toBeGreaterThan(0);
      expect(hospitals).toContain('abc-general');
      expect(hospitals).not.toContain('template'); // template.yaml should be excluded
    });
  });

  describe('generateThemeCSS', () => {
    let config: HospitalConfig;

    beforeAll(() => {
      config = loadHospitalConfig('abc-general');
    });

    it('should generate CSS variables from branding config', () => {
      const css = generateThemeCSS(config);

      expect(css).toContain('--color-primary');
      expect(css).toContain('--color-secondary');
      expect(css).toContain('--color-accent');
      expect(css).toContain('--font-heading');
      expect(css).toContain('--font-body');
    });

    it('should include actual color values in CSS', () => {
      const css = generateThemeCSS(config);

      expect(css).toContain(config.branding.colors.primary);
      expect(css).toContain(config.branding.colors.secondary);
      expect(css).toContain(config.branding.colors.accent);
    });

    it('should include font families in CSS', () => {
      const css = generateThemeCSS(config);

      expect(css).toContain(config.branding.fonts.heading);
      expect(css).toContain(config.branding.fonts.body);
    });
  });

  describe('Configuration Structure', () => {
    let config: HospitalConfig;

    beforeAll(() => {
      config = loadHospitalConfig('abc-general');
    });

    it('should have valid hero carousel configuration', () => {
      expect(config.heroCarousel).toBeDefined();
      expect(config.heroCarousel.autoPlay).toBeTypeOf('boolean');
      expect(config.heroCarousel.interval).toBeTypeOf('number');
      expect(config.heroCarousel.interval).toBeGreaterThan(0);
      expect(Array.isArray(config.heroCarousel.images)).toBe(true);
      expect(config.heroCarousel.images.length).toBeGreaterThan(0);
    });

    it('should have valid service categories configuration', () => {
      expect(config.serviceCategories).toBeDefined();

      if (config.serviceCategories.laboratory) {
        expect(config.serviceCategories.laboratory.enabled).toBeTypeOf('boolean');
      }

      if (config.serviceCategories.pharmacy) {
        expect(config.serviceCategories.pharmacy.enabled).toBeTypeOf('boolean');
      }

      if (config.serviceCategories.emergency) {
        expect(config.serviceCategories.emergency.enabled).toBeTypeOf('boolean');
      }
    });

    it('should have valid specialties configuration', () => {
      expect(config.specialties).toBeDefined();
      expect(Array.isArray(config.specialties.enabled)).toBe(true);
      expect(config.specialties.enabled.length).toBeGreaterThan(0);
    });

    it('should have valid language configuration', () => {
      expect(config.languages).toBeDefined();
      expect(config.languages.default).toBeTypeOf('string');
      expect(Array.isArray(config.languages.supported)).toBe(true);
      expect(config.languages.supported).toContain(config.languages.default);
    });

    it('should have valid maps integration', () => {
      expect(config.integrations.maps).toBeDefined();
      expect(config.integrations.maps.latitude).toBeTypeOf('number');
      expect(config.integrations.maps.longitude).toBeTypeOf('number');
      expect(config.integrations.maps.latitude).toBeGreaterThanOrEqual(-90);
      expect(config.integrations.maps.latitude).toBeLessThanOrEqual(90);
      expect(config.integrations.maps.longitude).toBeGreaterThanOrEqual(-180);
      expect(config.integrations.maps.longitude).toBeLessThanOrEqual(180);
    });
  });
});
