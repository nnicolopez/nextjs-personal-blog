import { Link } from "@chakra-ui/next-js";
import {
  Flex,
  List,
  ListItem,
  Switch,
  Text,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";

const MainNav = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const theme = useTheme();

  console.log(theme);

  return (
    <Flex
      as="header"
      gap={10}
      width="100%"
      height={"80px"}
      alignItems={"center"}
      padding={"10px 30px"}
      // borderBottom={"1px"}
      // borderColor={"gray.300"}
    >
      <Link href="/">Home</Link>

      <List ml={"auto"} display={"flex"} gap={5}>
        <ListItem>
          <Link href="/programming">Programming</Link>
        </ListItem>
        <ListItem>
          <Link href="/music">Music</Link>
        </ListItem>
        <ListItem>
          <Link href="/sports">Sports</Link>
        </ListItem>
        <ListItem>
          <Link href="/contact">Contact</Link>
        </ListItem>
      </List>
      <Flex display="flex" alignItems="center">
        <Text my={1} mx={2} textTransform="capitalize">
          {colorMode} theme
        </Text>
        <Switch id="color-mode" onChange={toggleColorMode} />
      </Flex>
    </Flex>
  );
};

export default MainNav;
