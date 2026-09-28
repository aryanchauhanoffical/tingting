"use client";

import { useEffect, useState } from "react";
import { DEFAULT_ACCENT, THEME_EVENT, readAccent, type Theme } from "./theme";

/**
 * The live accent, for the pieces that paint themselves: canvas equalizers, SVG
 * gradients, and the WebGL orb. Those cannot read a CSS variable, so they read the
 * resolved value here and re-render when the preview bar changes it.
 *
 * Starts on the default rather than reading during render, so the server and the
 * first client paint agree.
 */
export function useAccent(): string {
  const [accent, setAccent] = useState(DEFAULT_ACCENT);

  useEffect(() => {
    setAccent(readAccent());
    const onTheme = (e: Event) => setAccent((e as CustomEvent<Theme>).detail.accent);
    window.addEventListener(THEME_EVENT, onTheme);
    return () => window.removeEventListener(THEME_EVENT, onTheme);
  }, []);

  return accent;
}
