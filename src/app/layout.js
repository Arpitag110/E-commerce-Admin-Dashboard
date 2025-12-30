import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthWrapper from "../components/AuthWrapper";
import { ToastProvider } from "../components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-commerce Admin Dashboard",
  description: "Product Management Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
