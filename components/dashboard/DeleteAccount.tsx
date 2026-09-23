import { Button } from "@mantine/core";
import { deleteAccountAction } from "@/app/actions";
import SubmitButton from "@/components/ui/SubmitButton";
import type { Dictionary } from "@/lib/i18n";
import classes from "./DeleteAccount.module.css";

/**
 * Two-step delete: the first click only reveals the real button, to the
 * right of the toggle so a double click can't hit it by accident.
 * Uses <details> so it works before the page hydrates.
 */
const DeleteAccount = ({ t }: { t: Dictionary }) => (
  <details className={classes.confirm}>
    <Button component="summary" variant="outline" color="red" className={classes.summary}>
      <span className={classes.closed}>{t.deleteAccount}</span>
      <span className={classes.open}>{t.cancel}</span>
    </Button>
    <form action={deleteAccountAction}>
      <SubmitButton color="red">{t.confirmDelete}</SubmitButton>
    </form>
  </details>
);

export default DeleteAccount;
