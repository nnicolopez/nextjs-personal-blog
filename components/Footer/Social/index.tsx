import Link from "next/link";
import { Flex, Title, Text, Anchor } from "@mantine/core";
import { CSSProperties } from "react";
import { FaGithubSquare, FaInstagramSquare, FaLinkedin } from "react-icons/fa";

const linkStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
};

const SocialNetworks = () => {
  return (
    <Flex direction="column">
      <Title order={4} mb="md">
        Follow me on:
      </Title>
      <Flex component="ul" direction="column" gap="xs" style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Anchor href="https://www.linkedin.com/in/nnicolopez" target="_blank" style={linkStyle}>
            <FaLinkedin size={32} />
            <Text>LinkedIn</Text>
          </Anchor>
        </li>
        <li>
          <Anchor href="https://github.com/nnicolopez" target="_blank" style={linkStyle}>
            <FaGithubSquare size={32} />
            <Text>Github</Text>
          </Anchor>
        </li>
        <li>
          <Anchor href="https://www.instagram.com/nnicolaslopez/" target="_blank" style={linkStyle}>
            <FaInstagramSquare size={32} />
            <Text>Instagram</Text>
          </Anchor>
        </li>
      </Flex>
    </Flex>
  );
};

export default SocialNetworks;
