import { Divider, Flex } from "@mantine/core";
import Footer from "../Footer";
import MainNav from "../MainNav";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <Flex direction="column" style={{ minHeight: "100vh" }}>
      <MainNav />
      <Divider />
      <Flex component="main" style={{ flexGrow: 1 }} w="100%" direction="column">
        {children}
      </Flex>
      <Divider />
      <Footer />
    </Flex>
  );
};

export default Layout;
