import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const MusicPage = () => {
  return <div>MusicPage</div>;
};

export default MusicPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en")),
    },
  };
};
