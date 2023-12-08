import { Link } from "@chakra-ui/next-js";
import { cookies } from 'next/headers'
import {
  Flex,
  List,
  ListItem,
  Select,
  Switch,
  Text,
  useColorMode,
} from "@chakra-ui/react";

const MainNav = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  // const handleLanguageChange = (e: React.FormEvent<HTMLSelectElement>) => {
  //   cookies().set('NEXT_LOCALE', e.currentTarget.value)
  // }

  return (
    <Flex
      as="header"
      gap={5}
      width="100%"
      height={"80px"}
      alignItems={"center"}
      padding={"10px 30px"}
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
        <Text my={1} mr={2} textTransform="capitalize">
          {colorMode} theme
        </Text>
        <Switch id="color-mode" onChange={toggleColorMode} />
      </Flex>
      <Select
        width={"auto"}
        // onChange={handleLanguageChange}
      >
        <option value="en-US">EN</option>
        <option value="es">ES</option>
      </Select>
    </Flex>
  );
};

export default MainNav;
