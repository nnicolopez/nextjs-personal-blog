import Link from "next/link";
import { Flex, Title, Text, Anchor } from "@mantine/core";
import { CSSProperties } from "react";
import { FaReact } from "react-icons/fa";
import { SiNextdotjs, SiMantine } from "react-icons/si";

const linkStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
};

const Technologies = () => {
  return (
    <Flex direction="column">
      <Title order={4} mb="md">
        Technologies on this site:
      </Title>
      <Flex component="ul" direction="column" gap="xs" style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Anchor href="https://nextjs.org/" target="_blank" style={linkStyle}>
            <SiNextdotjs size={32} />
            <Text>Next.js</Text>
          </Anchor>
        </li>
        <li>
          <Anchor href="https://react.dev/" target="_blank" style={linkStyle}>
            <FaReact size={32} />
            <Text>React</Text>
          </Anchor>
        </li>
        <li>
          <Anchor href="https://mantine.dev/" target="_blank" style={linkStyle}>
            <SiMantine size={32} />
            <Text>Mantine</Text>
          </Anchor>
        </li>
      </Flex>
    </Flex>
  );
};

export default Technologies;
