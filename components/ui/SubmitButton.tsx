"use client";

import { Button, type ButtonProps } from "@mantine/core";
import { useFormStatus } from "react-dom";

type Props = ButtonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color" | "style">;

/** Mantine Button that submits its form and shows a spinner while the action runs. */
const SubmitButton = ({ disabled, ...props }: Props) => {
  const { pending } = useFormStatus();
  return <Button type="submit" loading={pending} disabled={disabled} {...props} />;
};

export default SubmitButton;
