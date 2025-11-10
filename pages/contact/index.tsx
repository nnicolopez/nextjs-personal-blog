/* eslint-disable react/no-unescaped-entities */
import {
  Button,
  Flex,
  TextInput,
  Textarea,
} from "@mantine/core";

const ContactPage = () => {
  return (
    <Flex w="100%" justify="center" mt="xl">
      <Flex w={500} direction="column" gap="lg">
        <TextInput
          label="Email address"
          type="email"
          description="We'll never share your email."
          withAsterisk
        />
        <Textarea
          label="Message"
          placeholder="Your message..."
          minRows={4}
        />
        <Button color="teal" type="submit">CONTACT</Button>
      </Flex>
    </Flex>
  );
};

export default ContactPage;
