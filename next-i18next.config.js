/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "default",
    locales: ["default", "en", "es"],
    localeDetection: false, // if true it causes too many redirects on middleware.ts
  },
};
