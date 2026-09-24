import { notFound } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

import { clerkEnabled } from "@/lib/clerk";

export default function SignUpPage() {
  if (!clerkEnabled) notFound();

  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <SignUp />
    </div>
  );
}
