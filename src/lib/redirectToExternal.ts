export function isEmbeddedInIframe(): boolean {
  try {
    return window.top !== window;
  } catch {
    // If we can't read window.top due to cross-origin restrictions,
    // treat it as embedded.
    return true;
  }
}

export function redirectToExternal(
  url: string,
  options?: { preOpenedWindow?: Window | null }
) {
  // If we managed to open a window synchronously (during the user click),
  // prefer using it — this avoids popup blockers in async flows.
  const w = options?.preOpenedWindow ?? null;
  if (w && !w.closed) {
    try {
      w.location.href = url;
      w.focus?.();
      return;
    } catch {
      // ignore
    }
  }

  // If embedded in an iframe, try to navigate the top frame first.
  if (isEmbeddedInIframe()) {
    try {
      window.top!.location.assign(url);
      return;
    } catch {
      // ignore
    }
  }

  // Prefer navigating the current browsing context.
  try {
    window.location.assign(url);
    return;
  } catch {
    // ignore
  }

  // Last resort: open a new tab/window (may be blocked by popup blockers).
  window.open(url, "_blank", "noopener,noreferrer");
}

