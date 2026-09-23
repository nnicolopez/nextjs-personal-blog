"use client";

import { useFormStatus } from "react-dom";
import ui from "./ui.module.css";

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

/** Submit button that disables itself while its form's action runs. */
const SubmitButton = ({ className = ui.btnPrimary, disabled, ...props }: Props) => {
  const { pending } = useFormStatus();
  return <button type="submit" className={className} disabled={disabled || pending} aria-busy={pending} {...props} />;
};

export default SubmitButton;
