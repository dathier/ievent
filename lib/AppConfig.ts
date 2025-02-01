export const AppConfig = {
  locales: ["en", "zh"] as const,
  defaultLocale: "en" as const,
  localePrefix: "always" as const, // 'as-needed' | 'always' | 'never'
  pages: {
    "*": ["common"],
    "/": ["home"],
    "/website/interactive/ideas": ["InteractiveIdeas"],
  },
};
