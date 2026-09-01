import "./globals.css";

export const metadata = {
  title: "Weather AI Planner",
  description: "AI-powered day planner based on weather",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}