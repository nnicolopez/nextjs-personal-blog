import "server-only";
import { revalidatePath } from "next/cache";

export type FormState = { ok?: boolean; errors?: Record<string, string>; values?: Record<string, string> };

export const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

// React resets a form after its action runs; sending the submitted values
// back lets the form show them again next to the errors.
export function fail(errors: Record<string, string>, formData: FormData): FormState {
  const values: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  });
  return { errors, values };
}

export function refresh() {
  revalidatePath("/", "layout");
}
