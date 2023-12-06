/* eslint-disable react/no-unescaped-entities */
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

const ContactPage = () => {
  return (
    <Flex width={"100%"} justifyContent={"center"} mt={20}>
      <Flex width={"500px"} direction={"column"} gap={"20px"}>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
          <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Message</FormLabel>
          <Textarea />
        </FormControl>
        <Button colorScheme='teal' type="submit">CONTACT</Button>
      </Flex>
    </Flex>
  );
};

export default ContactPage;
