/**
 * Hospital Configuration Loader
 *
 * Loads and validates hospital-specific configuration from YAML files.
 * Each hospital deployment uses a separate config file for branding, features, and integrations.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { z } from 'zod';

// ============================================================================
// Configuration Schema (Zod Validation)
// ============================================================================

const BrandingSchema = z.object({
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
});

const ContactSchema = z.object({
  phone: z.string(),
  emergency: z.string(),
  email: z.string().email(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
});

const FeaturesSchema = z.object({
  appointmentBooking: z.boolean(),
  patientPortal: z.boolean(),
  onlinePayments: z.boolean(),
  telemedicine: z.boolean(),
  multiLanguage: z.boolean(),
  blog: z.boolean(),
  careers: z.boolean(),
});

const LanguagesSchema = z.object({
  default: z.string(),
  supported: z.array(z.string()),
});

const ServiceCategoriesSchema = z.object({
  laboratory: z.object({
    enabled: z.boolean(),
    collectionTiming: z.string().optional(),
    reportDelivery: z.string().optional(),
    homeCollection: z.boolean().optional(),
  }).optional(),
  pharmacy: z.object({
    enabled: z.boolean(),
    hours: z.string().optional(),
    homeDelivery: z.boolean().optional(),
  }).optional(),
  radiology: z.object({
    enabled: z.boolean(),
    services: z.array(z.string()).optional(),
  }).optional(),
  emergency: z.object({
    enabled: z.boolean(),
    availability: z.string().optional(),
  }).optional(),
  icu: z.object({
    enabled: z.boolean(),
    types: z.array(z.string()).optional(),
  }).optional(),
});

const IntegrationsSchema = z.object({
  hms: z.object({
    enabled: z.boolean(),
    apiUrl: z.string().optional(),
  }),
  sms: z.object({
    provider: z.string(),
    from: z.string(),
  }),
  email: z.object({
    provider: z.string(),
    from: z.string().email(),
  }),
  maps: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  analytics: z.object({
    googleAnalyticsId: z.string().optional(),
  }),
  recaptcha: z.object({}).optional(),
});

const HeroCarouselSchema = z.object({
  autoPlay: z.boolean(),
  interval: z.number().positive(),
  images: z.array(
    z.object({
      url: z.string(),
      alt: z.string(),
      type: z.enum(['staff', 'facility', 'equipment', 'care']),
    })
  ),
});

export const HospitalConfigSchema = z.object({
  hospital: z.object({
    id: z.string(),
    name: z.string(),
    tagline: z.string(),
    logo: z.string(),
    favicon: z.string(),
    domain: z.string(),
  }),
  branding: BrandingSchema,
  contact: ContactSchema,
  features: FeaturesSchema,
  languages: LanguagesSchema,
  specialties: z.object({
    enabled: z.array(z.string()),
  }),
  serviceCategories: ServiceCategoriesSchema,
  integrations: IntegrationsSchema,
  heroCarousel: HeroCarouselSchema,
});

export type HospitalConfig = z.infer<typeof HospitalConfigSchema>;

// ============================================================================
// Configuration Loader
// ============================================================================

/**
 * Load hospital configuration from YAML file
 * @param hospitalId - Hospital identifier (e.g., 'abc-general')
 * @returns Validated hospital configuration
 */
export function loadHospitalConfig(hospitalId: string): HospitalConfig {
  const configPath = path.join(process.cwd(), 'config', 'hospitals', `${hospitalId}.yaml`);

  // Check if config file exists
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found for hospital: ${hospitalId} at ${configPath}`);
  }

  // Read YAML file
  const configFile = fs.readFileSync(configPath, 'utf8');
  const configData = yaml.parse(configFile);

  // Validate configuration against schema
  try {
    return HospitalConfigSchema.parse(configData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation errors:', error.errors);
      throw new Error(`Invalid configuration for hospital: ${hospitalId}`);
    }
    throw error;
  }
}

/**
 * Get current hospital configuration based on environment variable
 * Falls back to 'abc-general' if HOSPITAL_ID is not set
 */
export function getCurrentHospitalConfig(): HospitalConfig {
  const hospitalId = process.env.HOSPITAL_ID || 'abc-general';
  return loadHospitalConfig(hospitalId);
}

/**
 * Get list of available hospital configurations
 */
export function getAvailableHospitals(): string[] {
  const configDir = path.join(process.cwd(), 'config', 'hospitals');

  if (!fs.existsSync(configDir)) {
    return [];
  }

  return fs
    .readdirSync(configDir)
    .filter((file) => file.endsWith('.yaml') && file !== 'template.yaml')
    .map((file) => file.replace('.yaml', ''));
}

// ============================================================================
// CSS Variables Generator (for theme colors)
// ============================================================================

/**
 * Generate CSS variables from hospital branding configuration
 * @param config - Hospital configuration
 * @returns CSS string with custom properties
 */
export function generateThemeCSS(config: HospitalConfig): string {
  const { colors, fonts } = config.branding;

  return `
    :root {
      /* Brand Colors */
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};

      /* Fonts */
      --font-heading: ${fonts.heading}, sans-serif;
      --font-body: ${fonts.body}, sans-serif;
    }
  `.trim();
}
