import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { AiHero } from "@/components/ai-hero/AiHero";
import { AiSections } from "@/components/ai-page/AiSections";
import { getService } from "@/lib/content";
import { serviceMetadata, serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/site";

const service = getService("ai-automation");

export const metadata: Metadata = service ? serviceMetadata(service) : {};

export default function AiAutomationPage() {
  if (!service) notFound();

  return (
    <>
      <Header tone="light" />
      <main id="main-content" tabIndex={-1}>
        <AiHero />
        <AiSections service={service} />
      </main>
      <Footer />

      {/* Structured data: Service + FAQ + breadcrumb trail */}
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqSchema(service.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/#services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />
    </>
  );
}
