import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ProgrammingPage = () => {
  return <div>ProgrammingPage</div>;
};

export default ProgrammingPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en")),
    },
  };
};
