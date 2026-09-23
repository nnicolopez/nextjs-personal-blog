"use client";

import { TextInput, type TextInputProps } from "@mantine/core";

/** TextInput with the site host as a fixed prefix, like "example.com/". */
const UsernameInput = ({ host, ...props }: TextInputProps & { host: string }) => {
  const prefix = `${host}/`;
  return (
    <TextInput
      name="username"
      required
      maxLength={30}
      autoComplete="off"
      spellCheck={false}
      leftSection={prefix}
      // monospace prefix, so its width in ch is its length (plus padding)
      leftSectionWidth={`calc(${prefix.length}ch + 24px)`}
      leftSectionProps={{ style: { fontFamily: "monospace", fontSize: 13, justifyContent: "flex-end", paddingRight: 2 } }}
      styles={{ input: { fontFamily: "monospace", fontSize: 13 } }}
      {...props}
    />
  );
};

export default UsernameInput;
