import { Link } from "@chakra-ui/next-js";
import { Flex, Heading, Icon, List, ListItem, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";
import { FaGithubSquare, FaInstagramSquare, FaLinkedin } from "react-icons/fa";

const linkStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const SocialNetworks = () => {
  return (
    <Flex direction={"column"}>
      <Heading fontSize={18} mb={5}>
        Follow me on:
      </Heading>
      <List display={"flex"} flexDirection={"column"} gap={"2"}>
        <ListItem>
          <Link href={"https://www.linkedin.com/in/nnicolopez"} sx={linkStyle}>
            <Icon as={FaLinkedin} boxSize={8} />
            <Text>LinkedIn</Text>
          </Link>
        </ListItem>
        <ListItem>
          <Link href={"https://github.com/nnicolopez"} sx={linkStyle}>
            <Icon as={FaGithubSquare} boxSize={8} />
            <Text>Github</Text>
          </Link>
        </ListItem>
        <ListItem>
          <Link
            href={"https://www.instagram.com/nnicolaslopez/"}
            sx={linkStyle}
          >
            <Icon as={FaInstagramSquare} boxSize={8} />
            <Text>Instagram</Text>
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
};

export default SocialNetworks;
