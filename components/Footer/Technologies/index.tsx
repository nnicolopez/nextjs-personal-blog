import { Link } from "@chakra-ui/next-js";
import { Flex, Heading, List, ListItem, Icon, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";
import { FaReact } from "react-icons/fa";
import { SiNextdotjs, SiChakraui } from "react-icons/si";

const linkStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const Technologies = () => {
  return (
    <Flex direction={"column"}>
      <Heading fontSize={18} mb={5}>
        Technologies on this site:
      </Heading>
      <List display={"flex"} flexDirection={"column"} gap={"2"}>
        <ListItem>
          <Link href={"https://nextjs.org/"} sx={linkStyle}>
            <Icon as={SiNextdotjs} boxSize={8} />
            <Text>Next.js</Text>
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href={"https://react.dev/"}
            sx={linkStyle}
          >
            <Icon as={FaReact} boxSize={8} />
            <Text>React</Text>
          </Link>
        </ListItem>
        <ListItem>
          <Link href={"https://chakra-ui.com/"} sx={linkStyle}>
            <Icon as={SiChakraui} boxSize={8} />
            <Text>Chakra UI</Text>
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
};

export default Technologies;
