/**
 * Application Configuration
 *
 * Environment variables are accessed via import.meta.env in Vite
 * All variables must be prefixed with VITE_ to be exposed to the client
 */

export const config = {
  // Anthropic Claude API Configuration
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    model: 'claude-3-sonnet-20240229', // Default Claude model
    maxTokens: 4096,
  },

  // Application Settings
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Neofox HR',
    env: import.meta.env.VITE_APP_ENV || 'development',
    version: '1.0.0',
  },

  // Feature Flags
  features: {
    // Set to true to use real Claude API instead of mock analysis
    useRealAI: false, // Set to true when API key is configured
    enableEmailNotifications: false,
    enableDatabaseSync: false,
  },

  // Storage Keys
  storage: {
    prefix: 'neofox_hr_',
    version: 'v1',
  },

  // Analysis Configuration
  analysis: {
    weights: {
      technicalSkills: 0.25,
      experience: 0.20,
      education: 0.10,
      culturalFit: 0.15,
      communication: 0.10,
      leadership: 0.05,
      careerProgression: 0.05,
      salaryAlignment: 0.05,
      availability: 0.03,
      locationFit: 0.02,
    },
    thresholds: {
      excellent: 80,
      good: 60,
      fair: 40,
    },
  },
};

/**
 * Validate configuration on app startup
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for required API key if real AI is enabled
  if (config.features.useRealAI && !config.anthropic.apiKey) {
    errors.push(
      'VITE_ANTHROPIC_API_KEY is required when useRealAI is enabled. ' +
      'Get your API key from https://console.anthropic.com/settings/keys'
    );
  }

  // Validate weights sum to 1
  const totalWeight = Object.values(config.analysis.weights).reduce((sum, w) => sum + w, 0);
  if (Math.abs(totalWeight - 1.0) > 0.001) {
    errors.push(`Analysis weights must sum to 1.0, current sum: ${totalWeight}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if Claude API is configured
 */
export function isClaudeConfigured(): boolean {
  return !!(config.anthropic.apiKey && config.anthropic.apiKey.startsWith('sk-'));
}
