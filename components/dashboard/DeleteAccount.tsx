import { deleteAccountAction } from "@/app/actions";
import SubmitButton from "@/components/ui/SubmitButton";
import ui from "@/components/ui/ui.module.css";
import type { Dictionary } from "@/lib/i18n";
import styles from "./dashboard.module.css";

/**
 * Two-step delete: the first click only reveals the real button, to the
 * right of the toggle so a double click can't hit it by accident.
 * Uses <details> so it works before the page hydrates.
 */
const DeleteAccount = ({ t }: { t: Dictionary }) => (
  <details className={styles.confirm}>
    <summary className={ui.btnDanger}>
      <span className={styles.confirmClosed}>{t.deleteAccount}</span>
      <span className={styles.confirmOpen}>{t.cancel}</span>
    </summary>
    <form action={deleteAccountAction}>
      <SubmitButton className={`${ui.btnDanger} ${ui.btnDangerSolid}`}>{t.confirmDelete}</SubmitButton>
    </form>
  </details>
);

export default DeleteAccount;
