import { notFound } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

import { clerkEnabled } from "@/lib/clerk";

export default function SignInPage() {
  if (!clerkEnabled) notFound();

  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <SignIn />
    </div>
  );
}
