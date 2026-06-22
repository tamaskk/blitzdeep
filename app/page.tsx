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

// Blog is parked for now — may return in the future.
// import { NewsInsights } from "@/components/NewsInsights";

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
    </>
  );
}
