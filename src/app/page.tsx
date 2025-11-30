import ContentSection from "@/components/Content";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Powered Note-Taking Web App",
  description:
    "Organize your thoughts, ask questions, and get instant answers from your notes. Experience a seamless, distraction-free interface designed for clarity and productivity.",
  openGraph: {
    title: "nota - AI-Powered Note-Taking Web App",
    description:
      "Organize your thoughts, ask questions, and get instant answers from your notes. Experience a seamless, distraction-free interface designed for clarity.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "nota",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    description:
      "AI-powered note-taking app that helps you organize thoughts and get instant answers from your notes",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "100",
    },
    featureList: [
      "AI-powered search and insights",
      "Real-time collaboration",
      "End-to-end encryption",
      "Cross-platform sync",
      "Smart organization",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <Features />
      <ContentSection />
      <Footer />
    </>
  );
}

export default LandingPage;
