import { extendTheme } from "@chakra-ui/react";

// Here we can extend the themes for chakra ui
export const theme = extendTheme({
  // ...
  fonts: {
    heading: "var(--font-rubik)",
    body: "var(--font-rubik)",
  },
  // ...
});
