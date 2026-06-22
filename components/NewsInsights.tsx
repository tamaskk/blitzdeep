import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { POSTS, type Post } from "@/lib/content";

function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex h-full flex-col">
      <a href="#" className="block overflow-hidden rounded-3xl">
        <Placeholder
          className={cn(
            "aspect-[16/11] w-full bg-gradient-to-br transition-transform duration-[700ms] ease-out group-hover:scale-105",
            post.gradient
          )}
          rounded="rounded-none"
          label={`${post.title} cover`}
        />
      </a>
      <h3 className="mt-5 text-lg font-semibold text-heading transition-colors group-hover:text-brand">
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-body">{post.description}</p>
      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover"
      >
        Read more
        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
      </a>
    </article>
  );
}

export function NewsInsights() {
  return (
    <section id="blog" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Blog"
          title="News & Insights"
          description="We craft strategic frameworks that align your business goals with buyer expectations."
          action={{ label: "See All", href: "#" }}
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post, i) => (
            <Reveal key={post.title} delay={i * 120} className="h-full">
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
