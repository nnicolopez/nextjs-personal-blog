import Toggles from "@/components/ui/Toggles";
import type { Lang } from "@/lib/i18n";
import styles from "./dashboard.module.css";

const AppHeader = ({ title, lang }: { title: string; lang: Lang }) => (
  <div className={styles.header}>
    <h1>{title}</h1>
    <Toggles lang={lang} compact />
  </div>
);

export default AppHeader;
