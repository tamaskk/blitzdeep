/**
 * Tiny classnames helper — joins truthy class strings.
 * Avoids pulling in clsx/tailwind-merge for a project this size.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
