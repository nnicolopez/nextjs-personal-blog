import { setPublishedAction, setTemplateAction } from "@/app/actions";
import type { Template } from "@/db";
import SubmitButton from "@/components/ui/SubmitButton";
import type { ButtonProps } from "@mantine/core";

/**
 * One-click buttons backed by a server action. Each is a tiny form, so a
 * click works even before the page finishes hydrating, and the button
 * shows a spinner while the action runs so double clicks don't toggle twice.
 */

export const PublishButton = ({ isPublished, label, ...props }: { isPublished: boolean; label: string } & ButtonProps) => (
  <form action={setPublishedAction.bind(null, !isPublished)}>
    <SubmitButton {...props}>{label}</SubmitButton>
  </form>
);

export const TemplateButton = ({ template, label, disabled }: { template: Template; label: string; disabled: boolean }) => (
  <form action={setTemplateAction.bind(null, template)}>
    <SubmitButton fullWidth disabled={disabled}>{label}</SubmitButton>
  </form>
);
