import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { FOOTER_COLUMNS } from "@/lib/content";

const SOCIALS = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Twitter, label: "X (Twitter)", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
];
const LEGAL = ["Privacy", "Accessibility", "Terms", "Site map"];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page py-16">
        <Reveal className="grid gap-12 lg:grid-cols-[1.7fr_1fr_1fr_1.4fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Strategy. Design. Performance. Unified for measurable ROI.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact details */}
          <div>
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/55">
              <li>
                <a
                  href="mailto:info@blitzdeep.com"
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail size={15} className="shrink-0 text-brand" aria-hidden /> info@blitzdeep.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+13322788976"
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Phone size={15} className="shrink-0 text-brand" aria-hidden /> 332-278-8976
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50">
            <span className="text-white/70">
              BlitzDeep<span className="text-brand">©</span> {new Date().getFullYear()}
            </span>
            {LEGAL.map((item) => (
              <Link key={item} href="#" className="transition-colors hover:text-white">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {SOCIALS.map(({ Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                aria-label={`BlitzDeep on ${label}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <Icon size={15} aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
