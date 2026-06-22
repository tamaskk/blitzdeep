import { Mail, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const fieldBase =
  "w-full rounded-xl border border-white/10 bg-ink-800 px-4 text-sm text-white placeholder:text-white/35 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-white/80">
        {label}
        {required && <span className="text-brand">*</span>}
      </label>
      <input id={id} name={id} type={type} placeholder={placeholder} required={required} className={`${fieldBase} h-11`} />
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="relative flex-1 rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover">
      <span className="absolute right-4 top-4 flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
      </span>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-muted text-brand">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <p className="mt-4 text-sm font-semibold text-heading">{label}</p>
      <p className="mt-0.5 text-sm text-body">{value}</p>
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: heading + contact cards */}
        <Reveal className="flex flex-col">
          <span className="eyebrow">Contact</span>
          <h2 className="mt-4 font-semibold text-heading text-display-sm">Let&apos;s Talk</h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-body">
            Got questions or ready to start your design project? Let&apos;s bring your ideas to life.
          </p>

          <div className="mt-auto flex flex-col gap-4 pt-10 sm:flex-row">
            <ContactCard icon={Mail} label="Mail" value="info@blitzdeep.com" />
            <ContactCard icon={Phone} label="Phone" value="+332-278-8976" />
          </div>
        </Reveal>

        {/* Right: dark form */}
        <Reveal delay={120}>
        <form className="rounded-3xl bg-ink p-6 sm:p-8 transition-shadow duration-300 hover:shadow-card-hover">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="firstName" label="First name" placeholder="First name" required />
            <Field id="lastName" label="Last name" placeholder="Last name" required />
          </div>
          <div className="mt-5 grid gap-5">
            <Field id="email" label="Email" type="email" placeholder="Your Email" required />
            <Field id="website" label="Website" placeholder="Your Website" />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-medium text-white/80">
                Write Message<span className="text-brand">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Write your message here"
                required
                className={`${fieldBase} resize-none py-3`}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 h-12 w-full rounded-xl bg-brand text-sm font-semibold text-white shadow-btn transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover active:translate-y-0"
          >
            Send message
          </button>
        </form>
        </Reveal>
      </div>
    </section>
  );
}
