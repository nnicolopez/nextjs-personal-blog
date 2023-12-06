import { Flex, useTheme } from "@chakra-ui/react";
import SocialNetworks from "./Social";
import Technologies from "./Technologies";

const Footer = () => {
  const theme = useTheme()
  return (
    <Flex as="footer" height={200} gap={'100px'} justifyContent={'center'} padding={30}>
      <SocialNetworks />
      <Technologies />
    </Flex>
  );
};

export default Footer;
