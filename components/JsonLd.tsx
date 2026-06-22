/**
 * Renders a JSON-LD structured-data script. Google reads this from anywhere in
 * the document, so we render it inline within the page/layout body.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inject here (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
