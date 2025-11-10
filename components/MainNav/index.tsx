import Link from "next/link";
import {
  Flex,
  Switch,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";

const MainNav = () => {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  console.log(theme);

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
      <Flex align="center" gap="xs">
        <Text size="sm" tt="capitalize" mx="xs">
          {colorScheme} theme
        </Text>
        <Switch onChange={toggleColorScheme} />
      </Flex>
    </Flex>
  );
};

export default MainNav;
