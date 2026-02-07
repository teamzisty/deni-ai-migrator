import type * as React from "react";

import { cn } from "@/lib/utils";

function Alert({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-md border bg-card px-3.5 py-2.5 text-sm text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  // oxlint-disable-next-line jsx-a11y/heading-has-content -- content provided via spread props
  return <h5 className={cn("mb-0.5 text-sm font-medium leading-none tracking-tight", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-[13px] text-muted-foreground", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
