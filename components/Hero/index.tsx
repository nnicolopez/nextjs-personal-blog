/* eslint-disable react/no-unescaped-entities */
import { Flex, Title, Text } from "@mantine/core";
import Image from "next/image";

const Hero = () => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      w="100%"
      p="xl"
    >
      <Image
        src="/profile-picture.png"
        alt="profile picture"
        width={300}
        height={300}
        style={{ borderRadius: "50%", margin: "2.5rem" }}
      />
      <Title order={1} mb="md" size={48}>Hi, I&apos;m Nico</Title>
      <Text size="xl">This is a personal blog to show some of the things I love to do.</Text>
    </Flex>
  );
};

export default Hero;
