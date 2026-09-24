import Link from "next/link";
import type { ReactNode } from "react";

/** A Link when there is somewhere to go, otherwise a plain block. */
export function MaybeLink({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}
