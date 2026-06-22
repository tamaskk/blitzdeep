import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { FeaturedWork } from "@/components/FeaturedWork";
import { SuccessStories } from "@/components/SuccessStories";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/site";
import { FAQS } from "@/lib/content";

// Blog is parked for now — may return in the future.
// import { NewsInsights } from "@/components/NewsInsights";

export const metadata: Metadata = {
  description:
    "BlitzDeep builds high-converting websites, AI automation and social media marketing for B2B brands. One senior team, measurable growth — no fluff, no hand-offs.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Benefits />
        <FeaturedWork />
        <SuccessStories />
        <FAQ />
        {/* <NewsInsights /> */}
        <Contact />
      </main>
      <Footer />
      {/* Rich-result structured data for the on-page FAQ */}
      <JsonLd data={faqSchema(FAQS)} />
    </>
  );
}
