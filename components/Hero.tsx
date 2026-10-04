import Link from "next/link";
import { HeroVideo } from "@/components/HeroVideo";
import { PARTNERS } from "@/lib/content";

const HERO_VIDEO =
  "https://cdn.sceneai.art/Hero%20Section%20Video/736fd4a0-70ac-4f44-9633-55769ead6aca.mp4";

// The heading animates in word by word. Each entry is one line.
const HEADING: Array<Array<{ text: string; accent?: boolean }>> = [
  [{ text: "We" }, { text: "Build" }, { text: "B2B" }, { text: "Websites" }],
  [{ text: "That" }, { text: "Drive", accent: true }, { text: "Growth", accent: true }],
];

// Entrance timeline (seconds). Everything cascades in over roughly 4s; the
// nav (Header) leads at 0; the video fades up underneath once it has loaded.
const T = { heading: 0.5, word: 0.15, sub: 1.9, cta: 2.3, proof: 2.8, logos: 3.1, logo: 0.12 };

// A few faint stars across the top half: [left %, top %, size px].
const STARS: Array<[number, number, number]> = [
  [8, 14, 2],
  [19, 31, 1.5],
  [33, 9, 2],
  [47, 22, 1.5],
  [58, 12, 2.5],
  [71, 28, 1.5],
  [83, 8, 2],
  [92, 36, 1.5],
];

// Simple abstract marks, one per partner wordmark.
const MARKS = [
  <path key="a" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  <path key="b" d="M4 20C4 11 11 4 20 4c0 9-7 16-16 16Zm0 0 8-8" fill="none" strokeWidth="2" />,
  <circle key="c" cx="12" cy="12" r="8" fill="none" strokeWidth="2.5" />,
  <path key="d" d="M3 10 12 4l9 6v2H3v-2Zm2 4h3v5H5v-5Zm5.5 0h3v5h-3v-5Zm5.5 0h3v5h-3v-5Z" />,
  <path key="e" d="M12 3 21 20H3L12 3Z" fill="none" strokeWidth="2.5" strokeLinejoin="round" />,
];

const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

export function Hero() {
  let word = 0;

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0a0f14]"
    >
      <HeroVideo src={HERO_VIDEO} />

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Ambient glows */}
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-0 h-[320px] w-[320px] rounded-full bg-fuchsia-500/10 blur-[100px]" />
        {/* Keeps the left-aligned copy readable over the waves */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f14]/85 via-[#0a0f14]/40 to-transparent" />
        {/* Vignette: stacked blurred shapes melt the bottom-right of the video
            into the background */}
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[720px] rounded-full bg-[#0a0f14] blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-[360px] w-[520px] rounded-full bg-[#0a0f14] blur-[80px]" />
        <div className="absolute -bottom-10 -right-10 h-[200px] w-[320px] rounded-full bg-[#0a0f14] blur-[60px]" />
        {/* …and the whole bottom edge into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0f14] to-transparent" />
        {STARS.map(([left, top, size], i) => (
          <span
            key={i}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              ...delay(0.4 + i * 0.25),
            }}
            className="absolute animate-fade-in rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]"
          />
        ))}
      </div>

      {/* Main content */}
      <div className="container-page flex flex-1 flex-col justify-center pb-10 pt-32">
        <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
          {HEADING.map((line, l) => (
            <span key={l} className="block">
              {line.map((item) => (
                <span
                  key={item.text}
                  style={delay(T.heading + word++ * T.word)}
                  className={
                    item.accent
                      ? "mr-[0.22em] inline-block animate-fade-up font-serif text-[1.08em] font-normal italic"
                      : "mr-[0.25em] inline-block animate-fade-up"
                  }
                >
                  {item.text}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          style={delay(T.sub)}
          className="mt-5 max-w-md animate-fade-up text-base leading-relaxed text-gray-300 sm:text-lg"
        >
          Websites, AI automation and social media marketing, unified for measurable ROI.
        </p>

        <div style={delay(T.cta)} className="mt-8 animate-fade-up">
          <Link
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[15px] font-medium text-black transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none"
          >
            Let&rsquo;s Talk Strategy
          </Link>
        </div>
      </div>

      {/* Social proof */}
      <div className="container-page pb-10">
        <p style={delay(T.proof)} className="animate-fade-up text-sm text-gray-400">
          Trusted by <span className="font-medium text-white">300+</span> scaled brands worldwide
        </p>
        <ul className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-4">
          {PARTNERS.map((name, i) => (
            <li
              key={name}
              style={delay(T.logos + i * T.logo)}
              className="flex animate-fade-up items-center gap-2 text-lg font-semibold tracking-tight text-white/70 transition-colors hover:text-white"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current stroke-current"
                strokeWidth="0"
              >
                {MARKS[i % MARKS.length]}
              </svg>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
