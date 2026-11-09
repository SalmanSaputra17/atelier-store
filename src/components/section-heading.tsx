import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 md:mb-12">
      <div>
        <p className="label-caps text-ink-muted">{eyebrow}</p>
        <h2 className="mt-3 text-title">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="link shrink-0 label-caps">
          {action.label}
        </Link>
      )}
    </div>
  );
}
