"use client";

import { useCopy } from "@/context/copy-context";

/** First letter of an editable reviewer name, for the avatar circle. */
export function ReviewInitial({ id }: { id: string }) {
  return <>{useCopy().t(id).trim().charAt(0).toUpperCase()}</>;
}
