import AppHeader from "@/components/dashboard/AppHeader";
import { TemplateButton } from "@/components/dashboard/ActionButtons";
import PagePreview from "@/components/public/PagePreview";
import { TEMPLATES } from "@/db";
import { requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { toPublicPageData } from "@/lib/page-data";
import styles from "@/components/dashboard/dashboard.module.css";

const TemplatePage = async () => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();
  const data = toPublicPageData(account);

  return (
    <>
      <AppHeader title={t.navTemplatePage} lang={lang} />
      <p className={styles.lead}>{t.tplPageSub}</p>
      <div className={styles.templates}>
        {TEMPLATES.map((template) => {
          const inUse = account.page.template === template;
          return (
            <div key={template} className={`${styles.templateCard} ${inUse ? styles.templateCardActive : ""}`}>
              <div className={styles.templateThumb}>
                <PagePreview data={{ ...data, template }} height={170} scale={0.3} />
              </div>
              <div className={styles.templateName}>
                <span>{t.templates[template].name}</span>
                {inUse && <span className={styles.inUse}>{t.inUse}</span>}
              </div>
              <p>{t.templates[template].desc}</p>
              <TemplateButton template={template} label={t.useTemplate} disabled={inUse} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TemplatePage;
