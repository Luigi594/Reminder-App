"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode } from "react";

function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider attribute="class" enableSystem>
      {children}
    </NextThemeProvider>
  );
}

export default ThemeProvider;
