"use client";

import { ConfirmationProvider } from "@/components/shared/ConfirmPrompt";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ConfirmationProvider>{children}</ConfirmationProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
