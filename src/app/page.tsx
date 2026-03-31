"use client";

import { AlertCircle, Download, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-md flex-col gap-8 px-5 py-14 sm:py-20">
        {/* Header */}
        <header className="space-y-1">
          <p className="text-xs font-medium tracking-tight text-muted-foreground">
            deni ai migrator
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Message Migration
          </h1>
          <p className="text-[13px] leading-relaxed tracking-tight text-muted-foreground">
            Sign in to export your legacy chat data.
          </p>

          <div
            role="status"
            aria-live="polite"
            className={cn(
              "mt-4 relative overflow-hidden rounded-xl border px-3.5 py-3 shadow-sm transition-all",
              "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1",
              "bg-rose-100 dark:bg-rose-900",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center",
                  "border-rose-200 bg-rose-100/80 text-rose-700 dark:border-rose-800 dark:bg-rose-900/60 dark:text-rose-300",
                )}
              >
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium tracking-tight">
                  Deni AI Migrator ended on April 1st.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Steps */}
        <div className="grid gap-4">
          {/* Step 1 — Sign In */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold opacity-40 pointer-events-none">
                  1
                </span>
                <div>
                  <CardTitle>Authenticate</CardTitle>
                  <CardDescription>Connect your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div className="grid gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    <Github className="h-4 w-4" />
                    Continue with GitHub
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-[11px] font-medium tracking-tight text-muted-foreground">
                    or
                  </span>
                  <Separator className="flex-1" />
                </div>

                <div className="grid gap-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="login-email"
                      className="text-[12px] font-medium tracking-tight text-muted-foreground"
                    >
                      Email
                    </label>
                    <Input
                      id="login-email"
                      type="email"
                      disabled
                      placeholder="you@company.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="login-password"
                      className="text-[12px] font-medium tracking-tight text-muted-foreground"
                    >
                      Password
                    </label>
                    <Input
                      id="login-password"
                      type="password"
                      disabled
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <Button type="button" className="w-full" disabled>
                  <Mail className="h-4 w-4" />
                  Sign in with Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 — Export */}
          <Card className="transition-opacity duration-300 opacity-40 pointer-events-none">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold text-secondary-foreground">
                  2
                </span>
                <div>
                  <CardTitle>Export Data</CardTitle>
                  <CardDescription>
                    Download chat history as JSON
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button type="button" disabled className="w-full">
                <Download className="h-4 w-4" />
                Download message.json
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center text-[11px] tracking-tight text-muted-foreground/60">
          Deni AI &middot; Secure data migration
        </footer>
      </main>
    </div>
  );
}
