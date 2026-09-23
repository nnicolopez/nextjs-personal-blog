/* eslint-disable react/no-unescaped-entities */
import {
  Button,
  Flex,
  TextInput,
  Textarea,
} from "@mantine/core";
import Layout from "@/components/Layout";

const ContactPage = () => {
  return (
    <Layout>
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
    </Layout>
  );
};

export default ContactPage;
