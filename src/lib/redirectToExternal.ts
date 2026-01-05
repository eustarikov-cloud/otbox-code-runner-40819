export function redirectToExternal(url: string) {
  // Prefer navigating the current browsing context. This works reliably in most environments.
  try {
    window.location.assign(url);
    return;
  } catch {
    // ignore
  }

  // If embedded in an iframe, try to navigate the top frame.
  try {
    if (window.top && window.top !== window) {
      window.top.location.assign(url);
      return;
    }
  } catch {
    // ignore
  }

  // Last resort: open a new tab/window (may be blocked by popup blockers).
  window.open(url, "_blank", "noopener,noreferrer");
}
