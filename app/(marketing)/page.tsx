import Link from "next/link";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import Parallax from "@/components/marketing/Parallax";
import { samplePage } from "@/components/marketing/sample";
import PagePreview from "@/components/public/PagePreview";
import ui from "@/components/ui/ui.module.css";
import { getDictionary } from "@/lib/i18n";
import styles from "@/components/marketing/marketing.module.css";

const LandingPage = async () => {
  const { lang, t } = await getDictionary();

  return (
    <>
      <MarketingHeader lang={lang} t={t} landing />
      <main>
        <section className={styles.hero}>
          <Parallax />
          <div className={styles.heroContent}>
            <div className={styles.heroCopy}>
              <div className={styles.heroChip}>{t.heroChip}</div>
              <h1>{t.heroTitle}</h1>
              <p>{t.heroSub}</p>
              <div className={styles.heroCtas}>
                <Link href="/dashboard" className={`${ui.btnPrimary} ${styles.bigCta}`}>{t.heroCta}</Link>
                <a href="#plantilla" className={styles.heroCta2}>{t.heroCta2}</a>
              </div>
            </div>
            <div className={styles.heroMock}>
              <PagePreview data={samplePage(lang)} address="personalcms.com/nico" height={300} scale={0.45} />
            </div>
          </div>
        </section>

        <section id="quienes" className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionHead}>
            <h2>{t.whoTitle}</h2>
            <p>{t.whoSub}</p>
          </div>
          <div className={styles.whoGrid}>
            {t.who.map((item) => (
              <div key={item.title} className={styles.whoCard}>
                <div>{item.title}</div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className={`${styles.section} ${styles.sectionFeatures}`}>
          <div className={styles.sectionHead}>
            <h2>{t.featTitle}</h2>
            <p>{t.featSub}</p>
          </div>
          <div className={styles.featGrid}>
            {t.features.map((item, i) => (
              <div key={item.title} className={styles.feat}>
                <div className={i % 2 ? styles.featIcon2 : styles.featIcon1} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="plantilla" className={`${styles.section} ${styles.sectionTemplate}`}>
          <div className={styles.sectionHead}>
            <h2>{t.tplTitle}</h2>
            <p>{t.tplSub}</p>
          </div>
          <div className={styles.templateShowcase}>
            <PagePreview data={samplePage(lang, "profile")} height={420} scale={0.6} />
            <PagePreview data={samplePage(lang, "grid")} height={420} scale={0.6} />
          </div>
        </section>

        <section className={styles.cta}>
          <h2>{t.ctaTitle}</h2>
          <Link href="/dashboard" className={`${ui.btnPrimary} ${styles.bigCta}`}>{t.heroCta}</Link>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
