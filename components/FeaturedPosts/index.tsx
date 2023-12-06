import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

const FeaturedPosts = () => {
  return (
    <Flex direction={"column"} alignItems={"center"}>
      {/* <Heading>Featured Posts</Heading> */}
      <SimpleGrid
        margin={10}
        spacing={10}
        templateColumns="repeat(3, minmax(200px, 450px))"
      >
        {/* SHOULD SEPARATE THE CARD INTO A COMPONENT */}
        <Card>
          <CardHeader>
            <Heading size="md"> Programming</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              Have nearly six years of professional experience in UI
              applications design and development. I work with Ract nowadays,
              but I also worked with Angular and some bakends in the past.
            </Text>
          </CardBody>
          <CardFooter>
            <Link href="/programming">See more...</Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Heading size="md">Playing Music</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              I played the drums some years as a teenager in some garage bands.
              Years later I started stuying guitar. I definitely like music, but
              not only listening to it, but also understanding and feeling it.
            </Text>
          </CardBody>
          <CardFooter>
            <Link href="/music">See more...</Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Heading size="md">Sports</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              I have been training kickboxing with perseverance, I am about to
              receive the first belt. No plans on fighting by now, but who
              knows? By the moment is the sport I like practicing and it makes
              me feel better every day.
            </Text>
          </CardBody>
          <CardFooter>
            <Link href="/sports">See more...</Link>
          </CardFooter>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

export default FeaturedPosts;
