export type Theme = "light" | "dark" | "system";

/** Whether `document.documentElement` should have the `dark` class for this theme. */
export function shouldUseDarkClass(
  theme: Theme,
  prefersDark: boolean,
): boolean {
  if (theme === "system") return prefersDark;
  return theme === "dark";
}
