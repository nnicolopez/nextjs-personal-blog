import Link from "next/link";
import AppHeader from "@/components/dashboard/AppHeader";
import { PublishButton, SectionSwitch } from "@/components/dashboard/ActionButtons";
import PagePreview from "@/components/public/PagePreview";
import ui from "@/components/ui/ui.module.css";
import { getSiteHost, requireAccount } from "@/lib/data";
import { getDictionary, timeAgo } from "@/lib/i18n";
import { toPublicPageData } from "@/lib/page-data";
import styles from "@/components/dashboard/dashboard.module.css";

const DashboardPage = async () => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();
  const host = await getSiteHost();
  const { page, user, sections } = account;
  const isNew = !page.publishedAt;

  return (
    <>
      <AppHeader title={t.navSummary} lang={lang} />

      {isNew ? (
        <div className={`${ui.card} ${styles.steps}`}>
          <div className={styles.stepsKicker}>{t.startHere}</div>
          <h2>{t.threeSteps}</h2>
          <ol>
            <li>
              <span className={styles.stepNumber}>1</span>
              <span>{t.step1}</span>
              <Link href="/dashboard/editor" className={ui.btnLink}>{t.go}</Link>
            </li>
            <li>
              <span className={styles.stepNumber}>2</span>
              <span>{t.step2}</span>
              <Link href="/dashboard/template" className={ui.btnLink}>{t.go}</Link>
            </li>
            <li>
              <span className={styles.stepNumber}>3</span>
              <span>{t.step3}</span>
              <PublishButton isPublished={false} label={t.publishGo} className={ui.btnLink} />
            </li>
          </ol>
        </div>
      ) : (
        <>
          <div className={styles.greeting}>
            <span>{t.hello} {page.fullName} 👋</span>
            <span className={`${ui.chip} ${page.isPublished ? ui.chipActive : ""}`}>
              {page.isPublished ? t.published : t.draft}
            </span>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>{t.lastEdit}</div>
              <div className={styles.statValueSmall}>{timeAgo(page.updatedAt, lang, t.justNow)}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>{t.visibleSections}</div>
              <div className={styles.statValue}>
                {sections.filter((s) => s.isVisible).length}/{sections.length}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>{t.publishing}</div>
              <PublishButton
                isPublished={page.isPublished}
                label={page.isPublished ? t.moveToDraft : t.publish}
                className={page.isPublished ? ui.btnSecondary : `${ui.btnPrimary} ${styles.smallButton}`}
              />
            </div>
          </div>

          <div className={styles.overview}>
            <Link href={`/${user.username}`} className={styles.previewLink}>
              <PagePreview data={toPublicPageData(account)} address={`${host}/${user.username}`} height={300} scale={0.45} />
            </Link>
            <div className={`${ui.card} ${styles.quickSections}`}>
              <div className={styles.cardTitle}>{t.sections}</div>
              {sections.map((section) => (
                <div key={section.id} className={styles.quickRow}>
                  <span>{t.sectionLabels[section.type]}</span>
                  <SectionSwitch sectionId={section.id} visible={section.isVisible} label={t.sectionLabels[section.type]} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardPage;
