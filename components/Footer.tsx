import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { FOOTER_COLUMNS } from "@/lib/content";

const SOCIALS = [Facebook, Twitter, Instagram, Linkedin, Youtube];
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
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-brand" /> info@blitzdeep.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-brand" /> 332-278-8976
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand" />
                <span>11304 Preston Rd, Suite 460 Dallas, Texas 75252</span>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50">
            <span className="text-white/70">
              BlitzDeep<span className="text-brand">©</span> 2025
            </span>
            {LEGAL.map((item) => (
              <Link key={item} href="#" className="transition-colors hover:text-white">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {SOCIALS.map((Icon, i) => (
              <Link
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:border-brand hover:text-brand"
              >
                <Icon size={15} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
