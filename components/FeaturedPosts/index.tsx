import Link from "next/link";
import {
  Card,
  Flex,
  SimpleGrid,
  Text,
  Title,
  Anchor,
} from "@mantine/core";

const FeaturedPosts = () => {
  return (
    <Flex direction="column" align="center">
      {/* <Title>Featured Posts</Title> */}
      <SimpleGrid
        m="xl"
        spacing="xl"
        cols={{ base: 1, sm: 2, lg: 3 }}
        style={{ maxWidth: "1400px" }}
      >
        {/* SHOULD SEPARATE THE CARD INTO A COMPONENT */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section inheritPadding py="xs">
            <Title order={3}>Programming</Title>
          </Card.Section>

          <Text mt="sm" c="dimmed" size="sm">
            Have nearly six years of professional experience in UI
            applications design and development. I work with Ract nowadays,
            but I also worked with Angular and some bakends in the past.
          </Text>

          <Card.Section inheritPadding mt="sm" pb="md">
            <Anchor component={Link} href="/programming" size="sm">
              See more...
            </Anchor>
          </Card.Section>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section inheritPadding py="xs">
            <Title order={3}>Playing Music</Title>
          </Card.Section>

          <Text mt="sm" c="dimmed" size="sm">
            I played the drums some years as a teenager in some garage bands.
            Years later I started stuying guitar. I definitely like music, but
            not only listening to it, but also understanding and feeling it.
          </Text>

          <Card.Section inheritPadding mt="sm" pb="md">
            <Anchor component={Link} href="/music" size="sm">
              See more...
            </Anchor>
          </Card.Section>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section inheritPadding py="xs">
            <Title order={3}>Sports</Title>
          </Card.Section>

          <Text mt="sm" c="dimmed" size="sm">
            I have been training kickboxing with perseverance, I am about to
            receive the first belt. No plans on fighting by now, but who
            knows? By the moment is the sport I like practicing and it makes
            me feel better every day.
          </Text>

          <Card.Section inheritPadding mt="sm" pb="md">
            <Anchor component={Link} href="/sports" size="sm">
              See more...
            </Anchor>
          </Card.Section>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

export default FeaturedPosts;
