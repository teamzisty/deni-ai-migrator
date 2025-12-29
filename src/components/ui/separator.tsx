import type * as React from "react";

import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}) {
  const classes = cn(
    "shrink-0 bg-border",
    orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
    className,
  );

  if (decorative) {
    return (
      <div
        role="presentation"
        aria-hidden="true"
        className={classes}
        {...props}
      />
    );
  }

  return <hr aria-orientation={orientation} className={classes} {...props} />;
}

export { Separator };
