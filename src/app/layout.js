import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Weather AI Planner",
  description: "AI-powered day planner based on weather",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}