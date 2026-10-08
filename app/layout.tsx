import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hearthly — Home food, shared locally",
  description: "Order thoughtful meals, learn from local home chefs, and turn a home kitchen into a trusted food service.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
