import Link from "next/link";
import {
  ActionIcon,
  Flex,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const MainNav = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const theme = useMantineTheme();

  return (
    <Flex
      component="header"
      gap="md"
      w="100%"
      h={80}
      align="center"
      px={30}
      py={10}
      // style={{ borderBottom: "1px solid", borderColor: theme.colors.gray[3] }}
    >
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        Home
      </Link>

      <Flex component="ul" style={{ listStyle: "none", marginLeft: "auto", padding: 0 }} gap="md">
        <li>
          <Link href="/programming" style={{ textDecoration: "none", color: "inherit" }}>
            Programming
          </Link>
        </li>
        <li>
          <Link href="/music" style={{ textDecoration: "none", color: "inherit" }}>
            Music
          </Link>
        </li>
        <li>
          <Link href="/sports" style={{ textDecoration: "none", color: "inherit" }}>
            Sports
          </Link>
        </li>
        <li>
          <Link href="/contact" style={{ textDecoration: "none", color: "inherit" }}>
            Contact
          </Link>
        </li>
      </Flex>
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant="default"
        size="xl"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === 'light' ? (
          <MdLightMode size={20} />
        ) : (
          <MdDarkMode size={20} />
        )}
      </ActionIcon>
    </Flex>
  );
};

export default MainNav;
