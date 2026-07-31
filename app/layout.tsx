import type { Metadata } from "next";
import { ToastProvider } from "@/hooks/use-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leave — Time off, handled",
  description: "Request and approve leave in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
