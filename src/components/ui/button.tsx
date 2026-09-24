import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// shadcn/ui Button, re-skinned for the Baluti design: square corners
// (2px), semibold 15px labels and .25s transitions.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[2px] text-center text-[15px] font-semibold transition-[transform,background-color,border-color,color] duration-250 outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Solid crimson; lifts and brightens on hover. */
        primary:
          "bg-crimson text-white hover:-translate-y-0.5 hover:bg-crimson-light hover:text-white",
        /** Solid black; turns crimson on hover. */
        dark: "bg-ink text-white hover:bg-crimson hover:text-white",
        /** Outline on black backgrounds. */
        ghostOnDark:
          "border border-white/28 text-white hover:border-crimson hover:text-white",
        /** Outline on light backgrounds. */
        ghost:
          "border border-black/25 text-ink hover:border-crimson hover:text-ink",
        /** Outline on crimson: fills white with crimson text on hover. */
        outlineWhite:
          "border border-white/80 text-[13.5px] tracking-[.12em] text-white uppercase hover:bg-white hover:text-crimson",
      },
      size: {
        default: "px-[30px] py-[15px]",
        sm: "px-[22px] py-3 text-sm",
        /** Standalone CTA: 90% wide below 640px, min 280px above. */
        cta: "mx-auto block w-[90%] px-8 py-[15px] sm:mx-0 sm:inline-block sm:w-auto sm:min-w-[280px]",
        full: "flex w-full p-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
