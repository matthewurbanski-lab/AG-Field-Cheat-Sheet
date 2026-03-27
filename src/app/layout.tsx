import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matthew Urbanski | CFI — AquaGuard Foundation Solutions",
  description:
    "Schedule your free home inspection with Certified Field Inspector Matthew Urbanski. AquaGuard Foundation Solutions — Georgia's trusted expert in foundation repair, basement waterproofing, crawl space & concrete.",
  keywords: [
    "foundation repair Georgia",
    "basement waterproofing",
    "crawl space encapsulation",
    "concrete lifting",
    "AquaGuard",
    "free inspection",
    "Matthew Urbanski",
  ],
  openGraph: {
    title: "Schedule Your Free Inspection | Matthew Urbanski — AquaGuard",
    description:
      "Georgia's trusted expert in foundation repair, basement waterproofing, crawl space & concrete. Book your free inspection today.",
    type: "website",
    url: "https://mattataquaguard.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
