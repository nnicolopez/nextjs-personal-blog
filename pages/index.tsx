import FeaturedPosts from "@/components/FeaturedPosts";
import Hero from "@/components/Hero";
import Layout from "@/components/Layout";

const Home = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedPosts />
    </Layout>
  );
}

export default Home;
