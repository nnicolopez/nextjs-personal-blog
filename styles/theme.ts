import { createTheme, MantineColorsTuple } from "@mantine/core";

/**
 * Mantine Theme Configuration
 *
 * This is where we configure the global theme for the application.
 * In the future, this will be extended to support user-customizable themes.
 *
 * Documentation: https://mantine.dev/theming/theme-object/
 */

// Custom color palettes (for future V2 theming)
// const brandColor: MantineColorsTuple = [
//   '#e7f5ff',
//   '#b3d9ff',
//   '#80bdff',
//   '#4da1ff',
//   '#1a85ff',
//   '#0070f3', // Base brand color
//   '#005bb5',
//   '#004687',
//   '#003059',
//   '#001b2b',
// ];

export const theme = createTheme({
  /**
   * Typography
   * Uses Inter font loaded via Next.js font optimization
   * Inter is a modern, professional sans-serif font designed for UI
   */
  fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headings: {
    fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: "600",
    // Heading sizes can be customized here
    sizes: {
      h1: { fontSize: "2.5rem", lineHeight: "1.2" },
      h2: { fontSize: "2rem", lineHeight: "1.3" },
      h3: { fontSize: "1.5rem", lineHeight: "1.4" },
    },
  },

  /**
   * Spacing scale (in px)
   * Default: xs: 10, sm: 12, md: 16, lg: 20, xl: 32
   */
  // spacing: {
  //   xs: '0.625rem',
  //   sm: '0.75rem',
  //   md: '1rem',
  //   lg: '1.25rem',
  //   xl: '2rem',
  // },

  /**
   * Border radius
   * Default: xs: 2, sm: 4, md: 8, lg: 16, xl: 32
   */
  // radius: {
  //   xs: '0.125rem',
  //   sm: '0.25rem',
  //   md: '0.5rem',
  //   lg: '1rem',
  //   xl: '2rem',
  // },

  /**
   * Custom colors (V2 - for user theming)
   * Users will be able to select from predefined color schemes
   */
  // colors: {
  //   brand: brandColor,
  // },
  // primaryColor: 'brand',

  /**
   * Global styles
   * Apply CSS that affects all components
   */
  // globalStyles: (theme) => ({
  //   body: {
  //     backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  //   },
  // }),

  /**
   * Component-specific default props
   * Set defaults for all instances of a component
   */
  components: {
    // Button: {
    //   defaultProps: {
    //     size: 'md',
    //     radius: 'md',
    //   },
    // },
    // Card: {
    //   defaultProps: {
    //     shadow: 'sm',
    //     radius: 'md',
    //   },
    // },
  },
});
