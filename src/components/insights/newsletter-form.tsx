"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

// TODO: connect to the firm's mailing list provider.
export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubscribed(true);
      }}
      className="mx-auto flex max-w-[520px] flex-wrap gap-3"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        required
        type="email"
        placeholder="Your email address"
        className="min-w-[220px] flex-1 rounded-[2px] border border-white/16 bg-[#26262B] p-[15px] text-[15px] text-white placeholder:text-white/50 focus:border-crimson focus:outline-none"
      />
      <Button type="submit" variant="light" className="cursor-pointer px-7 py-[15px]">
        {subscribed ? "Subscribed ✓" : "Subscribe"}
      </Button>
    </form>
  );
}
