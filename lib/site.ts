/**
 * Central site / SEO configuration. Update `url` to the production domain once
 * deployed — every canonical, sitemap, robots and JSON-LD URL derives from it.
 */
export const siteConfig = {
  name: "BlitzDeep",
  url: "https://blitzdeep.com",
  title: "BlitzDeep — Websites, AI Automation & Social Media Marketing",
  description:
    "BlitzDeep builds conversion-focused websites, AI automation and social media marketing that drive measurable growth for B2B brands. Strategy, design and performance, unified for ROI.",
  locale: "en_US",
  email: "info@blitzdeep.com",
  phone: "+1-332-278-8976",
  twitter: "@blitzdeep",
  keywords: [
    "web development agency",
    "website development",
    "AI automation",
    "marketing automation",
    "social media marketing",
    "B2B marketing agency",
    "Next.js development",
    "conversion optimization",
    "lead generation",
    "digital agency",
    "BlitzDeep",
  ],
} as const;

/** Turn a path into an absolute URL against the site origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

/* ---------- JSON-LD builders ---------- */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/favicon.ico"),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    founder: { "@type": "Person", name: "Tamas Krisztian Kalman" },
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      telephone: siteConfig.phone,
      contactType: "sales",
      availableLanguage: ["English"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceSchema(service: {
  slug: string;
  title: string;
  overview: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.overview,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: "Worldwide",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
