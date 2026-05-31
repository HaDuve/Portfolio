/** Next open state after toggling the mobile nav menu button. */
export function nextMobileNavOpen(isOpen: boolean): boolean {
  return !isOpen;
}

export function mobileNavPanelClass(isOpen: boolean): string {
  return isOpen
    ? "pointer-events-auto translate-y-0 opacity-100"
    : "pointer-events-none -translate-y-full opacity-0";
}
