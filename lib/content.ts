/**
 * Centralised page content. All copy lives here so sections stay presentational.
 * Images are stable Unsplash photo IDs (verified to resolve) served through the
 * `imageUrl` / `avatarUrl` helpers below.
 */

/* ---------- Image helpers ---------- */

/** Real human portraits from Unsplash (free to use). */
export const PEOPLE = [
  "photo-1494790108377-be9c29b29330",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1438761681033-6461ffad8d80",
  "photo-1500648767791-00dcc994a43e",
  "photo-1534528741775-53994a69daeb",
  "photo-1633332755192-727a05c4013d",
  "photo-1517841905240-472988babdf9",
  "photo-1599566150163-29194dcaad36",
];

export function avatarUrl(id: string, size = 96): string {
  return `https://images.unsplash.com/${id}?w=${size}&h=${size}&fit=crop&crop=faces&auto=format&q=80`;
}

export function imageUrl(id: string, w = 1200, h?: number): string {
  const crop = h ? `&h=${h}&fit=crop` : "";
  return `https://images.unsplash.com/${id}?w=${w}${crop}&auto=format&q=80`;
}

/* ---------- Navigation ---------- */

// "What We Do" is rendered as a dropdown in the header (see Header.tsx) — its
// items come from SERVICES below. The rest are plain anchor / page links.
export const NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Benefits", href: "/#benefits" },
  { label: "Testimonial", href: "/#testimonials" },
  { label: "About", href: "/about" },
];

/* ---------- Services (the 3 things we do) ---------- */

export type ServiceFeature = { title: string; description: string };

export type Service = {
  slug: string;
  icon: "web" | "ai" | "social";
  title: string;
  description: string; // short copy used on cards
  tagline: string; // service-page hero subtitle
  overview: string; // longer intro paragraph
  tags: string[];
  features: ServiceFeature[];
  image: string;
};

export const SERVICES: Service[] = [
  {
    slug: "website-development",
    icon: "web",
    title: "Website Development",
    description:
      "Conversion-focused, lightning-fast websites built on modern stacks — designed to turn visitors into qualified leads.",
    tagline: "Websites that turn visitors into revenue.",
    overview:
      "We design and build conversion-focused, lightning-fast websites that work as hard as your sales team. From strategy and UX to development and launch, every decision is anchored to the metrics that grow your business.",
    tags: ["UI/UX Design", "Next.js & Webflow", "SEO Ready", "CMS Setup"],
    features: [
      {
        title: "Conversion-First Design",
        description:
          "Every page is wireframed around your funnel and the exact action you want visitors to take.",
      },
      {
        title: "Modern, Fast Stack",
        description:
          "Built on Next.js or Webflow with a headless CMS — instant loads and effortless editing.",
      },
      {
        title: "SEO Foundations",
        description:
          "Clean semantic markup, technical SEO and Core Web Vitals handled from day one.",
      },
      {
        title: "Analytics & Tracking",
        description:
          "Event tracking and dashboards so you always know what's converting and what isn't.",
      },
    ],
    image: "photo-1498050108023-c5249f4df085",
  },
  {
    slug: "ai-automation",
    icon: "ai",
    title: "AI Automation",
    description:
      "We connect your tools and automate repetitive work with AI — from lead routing to content, reporting and support workflows.",
    tagline: "Automate the busywork. Scale your output.",
    overview:
      "We map your workflows and add AI exactly where it saves the most time — connecting your tools into one smooth, automated engine so your team can focus on the work that actually moves the needle.",
    tags: ["Workflow Automation", "AI Agents", "CRM Integration", "Chatbots"],
    features: [
      {
        title: "Workflow Audit",
        description:
          "We map your processes and pinpoint exactly where AI and automation save the most time.",
      },
      {
        title: "Custom AI Agents",
        description:
          "Purpose-built agents that draft content, qualify leads and answer questions around the clock.",
      },
      {
        title: "Tool & CRM Integration",
        description:
          "We connect your stack — CRM, email, Slack, sheets — into one seamless, automated flow.",
      },
      {
        title: "Smart Reporting",
        description:
          "Automated reports and alerts so the right insights reach the right people on time.",
      },
    ],
    image: "photo-1518770660439-4636190af475",
  },
  {
    slug: "social-media-marketing",
    icon: "social",
    title: "Social Media Marketing",
    description:
      "Data-driven social campaigns that grow your audience and pipeline across every channel that matters to your buyers.",
    tagline: "Turn social channels into qualified pipeline.",
    overview:
      "Data-driven social campaigns that grow your audience and generate real pipeline. We handle strategy, content, paid ads and reporting across the channels your buyers actually use.",
    tags: ["Content Strategy", "Paid Ads", "Community", "Analytics"],
    features: [
      {
        title: "Content Strategy",
        description:
          "A clear monthly plan tied to your goals, voice and the platforms that matter most.",
      },
      {
        title: "Paid Advertising",
        description:
          "Targeted campaigns on LinkedIn, Meta and more — optimized relentlessly for qualified leads.",
      },
      {
        title: "Community Management",
        description:
          "We engage your audience daily and turn passive followers into an active community.",
      },
      {
        title: "Reporting & Analytics",
        description:
          "Transparent monthly dashboards tracking reach, leads, CAC and ROAS — no vanity metrics.",
      },
    ],
    image: "photo-1432888622747-4eb9a8efeb07",
  },
];

/** Look up a service by its URL slug. */
export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/* ---------- How It Works ---------- */

export type Step = {
  step: string;
  icon: "discovery" | "build" | "launch" | "optimize";
  title: string;
  description: string;
};

export const STEPS: Step[] = [
  {
    step: "01",
    icon: "discovery",
    title: "Discovery & Strategy",
    description:
      "We dig into your goals, audience and market to map a clear, measurable plan before any design begins.",
  },
  {
    step: "02",
    icon: "build",
    title: "Design & Development",
    description:
      "We design and build your website, automations and campaigns with weekly check-ins and full transparency.",
  },
  {
    step: "03",
    icon: "launch",
    title: "Launch & Integration",
    description:
      "We ship, connect your stack and make sure everything runs smoothly from day one — no loose ends.",
  },
  {
    step: "04",
    icon: "optimize",
    title: "Optimize & Scale",
    description:
      "We measure, test and refine continuously — turning data into compounding growth month over month.",
  },
];

/* ---------- Benefits ---------- */

export type Benefit = {
  icon: "roi" | "speed" | "team" | "scale" | "support" | "data";
  title: string;
  description: string;
};

export const BENEFITS: Benefit[] = [
  {
    icon: "roi",
    title: "Measurable ROI",
    description: "Every project is tied to KPIs you actually care about — leads, revenue and retention.",
  },
  {
    icon: "speed",
    title: "Fast Delivery",
    description: "Lean, focused sprints get you live in weeks, not months, without cutting corners.",
  },
  {
    icon: "team",
    title: "Dedicated Team",
    description: "A senior strategist, designer and developer on your project — no juniors, no hand-offs.",
  },
  {
    icon: "scale",
    title: "Built to Scale",
    description: "Clean, modern architecture that grows with you and never boxes you in.",
  },
  {
    icon: "support",
    title: "Ongoing Support",
    description: "We stick around after launch with proactive maintenance and improvements.",
  },
  {
    icon: "data",
    title: "Data-Driven",
    description: "Decisions backed by analytics and testing, not guesswork or opinions.",
  },
];

export const STATS = [
  { value: "300+", label: "Scaled Brands" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "98%", label: "Client Retention" },
  { value: "5+", label: "Years Experience" },
];

/* ---------- Reference / Featured Work ---------- */

export type Work = {
  title: string;
  subtitle: string;
  image: string;
  featured?: boolean;
};

export const WORKS: Work[] = [
  {
    title: "Annex Website",
    subtitle: "Website Development",
    image: "photo-1460925895917-afdab827c52f",
    featured: true,
  },
  {
    title: "Fintech Dashboard",
    subtitle: "Web & AI Automation",
    image: "photo-1556761175-5973dc0f32e7",
  },
  {
    title: "Lumen Social",
    subtitle: "Social Media Campaign",
    image: "photo-1563986768609-322da13575f3",
  },
  {
    title: "Northwind Studio",
    subtitle: "Website & SEO",
    image: "photo-1521737604893-d14cc237f11d",
  },
];

export const PARTNERS = ["Boltshift", "FeatherDev", "Spherule", "GlobalBank", "Nietzsche"];

/* ---------- Testimonials ---------- */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "BlitzDeep rebuilt our website and demo requests doubled in the first month. The team is fast, sharp and genuinely invested in our numbers.",
    name: "Bella Daniela",
    role: "Head of Growth",
    company: "Heroes Digital",
    avatar: PEOPLE[0],
    rating: 5,
  },
  {
    quote:
      "Their AI automation took 15 hours of manual work off my team every single week. It paid for itself within a month.",
    name: "Robbi Darwis",
    role: "Operations Lead",
    company: "TimeForge",
    avatar: PEOPLE[1],
    rating: 5,
  },
  {
    quote:
      "Our social pipeline has never been healthier. Qualified leads from LinkedIn are up 3x since we started working together.",
    name: "Marcus Lee",
    role: "CMO",
    company: "Northwind",
    avatar: PEOPLE[3],
    rating: 4.9,
  },
  {
    quote:
      "Working with BlitzDeep feels like having a senior in-house team. Clear communication, zero fluff and real, repeatable results.",
    name: "Sofia Almeida",
    role: "Founder",
    company: "Lumen Studio",
    avatar: PEOPLE[4],
    rating: 5,
  },
  {
    quote:
      "The new site is gorgeous and blazing fast. Our bounce rate dropped and conversions climbed within the first few weeks.",
    name: "David Chen",
    role: "VP Marketing",
    company: "GlobalBank",
    avatar: PEOPLE[5],
    rating: 5,
  },
  {
    quote:
      "From strategy to launch, every milestone landed on time. These are the people you want building your growth engine.",
    name: "Hannah Weber",
    role: "CEO",
    company: "Spherule",
    avatar: PEOPLE[6],
    rating: 4.9,
  },
];

/* ---------- FAQ ---------- */

export type FaqItem = { question: string; answer: string };

export const FAQS: FaqItem[] = [
  {
    question: "What services does your agency offer?",
    answer:
      "We focus on three things and do them exceptionally well: website development, AI automation, and social media marketing — all aligned around measurable business growth.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "We're built for speed — our projects launch faster than the competition. Once we kick off, your website comes together quickly, and automations and social campaigns start delivering shortly after, depending on scope.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Pricing is tailored to your scope and goals. Websites are a single upfront investment, while automation and social work run on a flexible monthly plan. Book a call and we'll put together a precise, no-obligation quote.",
  },
  {
    question: "What exactly does AI automation include?",
    answer:
      "We audit your workflows, then connect your tools and add AI where it saves the most time — lead routing, content generation, customer support, and automated reporting.",
  },
  {
    question: "How do you measure social media results?",
    answer:
      "We define KPIs up front (reach, qualified leads, CAC, ROAS) and report on them transparently every month with a live dashboard you can access anytime.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer:
      "Yes. Every engagement includes post-launch support, and most clients stay on a monthly plan for maintenance, optimization and new features.",
  },
];

/* ---------- About page ---------- */

export type Value = {
  icon: "transparency" | "craft" | "partnership" | "momentum";
  title: string;
  description: string;
};

export const VALUES: Value[] = [
  {
    icon: "transparency",
    title: "Radical Transparency",
    description: "Live dashboards, honest timelines and clear pricing. You always know exactly where things stand.",
  },
  {
    icon: "craft",
    title: "Obsessive Craft",
    description: "Pixel-perfect design and clean, performant code. We sweat the details so your brand looks elite.",
  },
  {
    icon: "partnership",
    title: "True Partnership",
    description: "We act like an extension of your team, not a vendor. Your goals become our goals.",
  },
  {
    icon: "momentum",
    title: "Relentless Momentum",
    description: "We move fast and keep shipping. Progress compounds when you never lose your stride.",
  },
];

export type TeamMember = { name: string; role: string; photo: string; bio: string };

/** The team is currently a one-person show — the founder. */
export const FOUNDER: TeamMember = {
  name: "Tamas Krisztian Kalman",
  role: "CEO & Founder",
  photo: "/team/tamas.jpg",
  bio: "Tamas founded BlitzDeep to close the gap between beautiful design and real business results. He leads strategy on every project — from high-converting websites to AI automation and social growth — and works directly with each client, no hand-offs.",
};

/* ---------- Blog / News (parked — not currently rendered, may return) ---------- */

export type Post = {
  title: string;
  description: string;
  gradient: string;
};

export const POSTS: Post[] = [
  {
    title: "Marketing Trends",
    description:
      "We provide strategy that aligns teams, sharpens messaging & positioning, and drives stronger marketing outcomes.",
    gradient: "from-rose-600 via-red-500 to-orange-500",
  },
  {
    title: "AI Buyer Experience",
    description:
      "We provide strategy that aligns teams, sharpens messaging & positioning, and drives stronger marketing outcomes.",
    gradient: "from-amber-300 via-yellow-400 to-lime-300",
  },
  {
    title: "Improve B2B Messaging",
    description:
      "We provide strategy that aligns teams, sharpens messaging & positioning, and drives stronger marketing outcomes.",
    gradient: "from-orange-500 via-red-500 to-rose-600",
  },
];

/* ---------- Footer ---------- */

export const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Reference", href: "/#reference" },
      { label: "Testimonials", href: "/#testimonials" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "What We Do", href: "/#services" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Benefits", href: "/#benefits" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
];
