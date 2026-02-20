/**
 * English Coach — Child-friendly Theme
 * Warm, encouraging color palette for middle schoolers
 */

export const COLORS = {
  // Primary palette — warm purple & teal
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',

  // Accent — warm orange for highlights & stars
  accent: '#F59E0B',
  accentLight: '#FCD34D',
  accentDark: '#D97706',

  // Teal for success / positive feedback
  success: '#14B8A6',
  successLight: '#5EEAD4',
  successDark: '#0D9488',

  // Coral for gentle alerts
  warning: '#FB7185',
  warningLight: '#FDA4AF',

  // Backgrounds
  background: '#F5F3FF',
  backgroundDark: '#1E1B4B',
  surface: '#FFFFFF',
  surfaceDark: '#312E81',

  // Text
  text: '#1E1B4B',
  textSecondary: '#6B7280',
  textLight: '#F5F3FF',
  textMuted: '#9CA3AF',

  // Chat bubbles
  userBubble: '#7C3AED',
  userBubbleText: '#FFFFFF',
  botBubble: '#EDE9FE',
  botBubbleText: '#1E1B4B',

  // Gradients
  gradientStart: '#7C3AED',
  gradientMiddle: '#6D28D9',
  gradientEnd: '#4F46E5',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const TYPOGRAPHY = {
  hero: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  small: {
    fontSize: 11,
    fontWeight: '500',
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  large: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
};

// Star rating emoji helper
export const getStarRating = (count, max = 5) => {
  return '⭐'.repeat(Math.min(count, max)) + '☆'.repeat(Math.max(0, max - count));
};

// Encouraging messages for different score ranges
export const ENCOURAGEMENTS = {
  high: [
    "🌟 Amazing work! You're a writing superstar!",
    "🎉 Wow, this is really impressive writing!",
    "✨ You should be so proud of this piece!",
    "🏆 Outstanding! Your skills are shining!",
  ],
  medium: [
    "💪 Great effort! You're getting stronger!",
    "🌱 You're growing as a writer — keep it up!",
    "📚 Nice work! Every draft makes you better!",
    "🎯 You're on the right track!",
  ],
  low: [
    "🌈 Every writer starts somewhere — you've got this!",
    "💫 I can see potential here! Let's build on it!",
    "🚀 Writing takes practice, and you're doing great by trying!",
    "🌻 Keep going! The best writers revise and improve!",
  ],
};

export const getRandomEncouragement = (level) => {
  const messages = ENCOURAGEMENTS[level] || ENCOURAGEMENTS.medium;
  return messages[Math.floor(Math.random() * messages.length)];
};
