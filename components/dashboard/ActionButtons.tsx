import { setPublishedAction, setTemplateAction, toggleSectionAction } from "@/app/actions";
import type { Template } from "@/db";
import SubmitButton from "@/components/ui/SubmitButton";
import ui from "@/components/ui/ui.module.css";
import styles from "./dashboard.module.css";

/**
 * One-click buttons backed by a server action. Each is a tiny form, so a
 * click works even before the page finishes hydrating, and the button
 * disables itself while the action runs so double clicks don't toggle twice.
 */

export const PublishButton = ({ isPublished, label, className }: { isPublished: boolean; label: string; className: string }) => (
  <form action={setPublishedAction.bind(null, !isPublished)} className={styles.inlineForm}>
    <SubmitButton className={className}>{label}</SubmitButton>
  </form>
);

export const SectionSwitch = ({ sectionId, visible, label }: { sectionId: string; visible: boolean; label: string }) => (
  <form action={toggleSectionAction.bind(null, sectionId)} className={styles.inlineForm}>
    <SubmitButton role="switch" aria-checked={visible} aria-label={label} className={ui.switch} />
  </form>
);

export const VisibilityChip = ({ sectionId, visible, label }: { sectionId: string; visible: boolean; label: string }) => (
  <form action={toggleSectionAction.bind(null, sectionId)} className={styles.inlineForm}>
    <SubmitButton aria-pressed={visible} className={`${ui.chip} ${ui.chipButton} ${visible ? ui.chipActive : ""}`}>
      {label}
    </SubmitButton>
  </form>
);

export const TemplateButton = ({ template, label, disabled }: { template: Template; label: string; disabled: boolean }) => (
  <form action={setTemplateAction.bind(null, template)}>
    <SubmitButton className={`${ui.btnPrimary} ${ui.btnBlock}`} disabled={disabled}>{label}</SubmitButton>
  </form>
);
