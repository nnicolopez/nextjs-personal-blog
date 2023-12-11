import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FeaturedPosts from "@/components/FeaturedPosts";
import Hero from "@/components/Hero";

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedPosts />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en")),
    },
  };
};
