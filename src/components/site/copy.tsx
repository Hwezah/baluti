"use client";

import { useCopy } from "@/context/copy-context";
import { telHref } from "@/content/copy";

/** Editable site text by id (see src/content/copy.ts and /admin). */
export function Copy({ id }: { id: string }) {
  return <>{useCopy().t(id)}</>;
}

/** An editable phone number as a tap-to-call link. */
export function PhoneLink({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const phone = useCopy().t(id);
  return (
    <a href={telHref(phone)} className={className}>
      {phone}
    </a>
  );
}

/** An editable email address as a mailto link. */
export function EmailLink({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  /** Link text; defaults to the address. */
  children?: React.ReactNode;
}) {
  const email = useCopy().t(id);
  return (
    <a href={`mailto:${email.trim()}`} className={className}>
      {children ?? email}
    </a>
  );
}

