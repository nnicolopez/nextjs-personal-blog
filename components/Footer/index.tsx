import { Flex } from "@mantine/core";
import SocialNetworks from "./Social";
import Technologies from "./Technologies";

const Footer = () => {
  return (
    <Flex component="footer" h={200} gap="xl" justify="center" p={30}>
      <SocialNetworks />
      <Technologies />
    </Flex>
  );
};

export default Footer;
