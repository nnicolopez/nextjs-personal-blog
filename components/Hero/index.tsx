/* eslint-disable react/no-unescaped-entities */
import { Flex, Heading, Text } from "@chakra-ui/react";
import ChakraNextImage from "../ui/Image";

const Hero = () => {
  return (
    <Flex
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      padding={6}
    >
      <ChakraNextImage
        src="/profile-picture.png"
        alt="profile picture"
        width={300}
        height={300}
        borderRadius={'50%'}
        margin={10}
      />
      <Heading as={'h1'} mb={5} fontSize={48}>Hi, I'm Nico</Heading>
      <Text fontSize={24}>This is a personal blog to show some of the things I love to do.</Text>
    </Flex>
  );
};

export default Hero;
