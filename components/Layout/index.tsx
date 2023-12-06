import { Divider, Flex } from "@chakra-ui/react";
import Footer from "../Footer";
import MainNav from "../MainNav";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <Flex direction={"column"} minHeight={"100vh"}>
      <MainNav />
      <Divider />
      <Flex as={"main"} grow={1} width={"100%"} flexDirection={"column"}>
        {children}
      </Flex>
      <Divider />
      <Footer />
    </Flex>
  );
};

export default Layout;
