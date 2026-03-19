"use client";

import {
  AlertCircle,
  CheckCircle2,
  Download,
  Github,
  LoaderCircle,
  LogOut,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { authClient } from "@/lib/auth-client";

function getOAuthErrorMessage(error: string | null) {
  if (error === "signup_disabled") {
    return "User not found";
  }
  if (!error) {
    return null;
  }
  return error
    .split("_")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function getMessageTone(message: string) {
  if (
    message === "Signing..." ||
    message === "Connecting..." ||
    message === "Loading..."
  ) {
    return "loading";
  }
  if (
    message === "Signed in." ||
    message === "Signed out." ||
    message === "downloaded"
  ) {
    return "success";
  }
  return "error";
}

export default function Home() {
  const [isExporting, setIsExporting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [socialProvider, setSocialProvider] = useState<
    "google" | "github" | null
  >(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: session, isPending: sessionPending } = authClient.useSession();
  const isAuthenticated = Boolean(session?.user);
  const authTone = authMessage ? getMessageTone(authMessage) : null;
  const exportTone = exportMessage ? getMessageTone(exportMessage) : null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const message = getOAuthErrorMessage(error);

    if (!message) {
      return;
    }

    setAuthMessage(message);
    params.delete("error");
    params.delete("error_description");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      setAuthMessage("Please enter your email and password.");
      return;
    }
    setIsSigningIn(true);
    setAuthMessage("Signing...");
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        setAuthMessage(error.message ?? "Sign in failed.");
        return;
      }
      setAuthMessage("Signed in.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setAuthMessage("Signing...");
    try {
      await authClient.signOut();
      setAuthMessage("Signed out.");
    } catch {
      setAuthMessage("Sign out failed.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialProvider(provider);
    setAuthMessage("Signing...");
    try {
      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: window.location.origin,
        errorCallbackURL: window.location.origin,
      });
      if (error) {
        setAuthMessage(error.message ?? "Social sign-in failed.");
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setAuthMessage("Unable to start social sign-in.");
    } catch (error) {
      setAuthMessage(
        error instanceof Error ? error.message : "Social sign-in failed.",
      );
    } finally {
      setSocialProvider(null);
    }
  };

  const handleExport = async () => {
    if (!isAuthenticated) {
      setExportMessage("Please sign in.");
      return;
    }
    setIsExporting(true);
    setExportMessage(null);
    try {
      const res = await fetch("/api/migration/export", { method: "GET" });
      if (!res.ok) {
        throw new Error("Export failed.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "message.json";
      a.click();
      window.URL.revokeObjectURL(url);
      setExportMessage("message.json downloaded.");
    } catch (error) {
      setExportMessage(
        error instanceof Error ? error.message : "Export failed.",
      );
    } finally {
      setIsExporting(false);
    }
  };

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
                  Deni AI Migration ends on April 1, and legacy data will be
                  deleted. Please export your data by April 1 if needed.
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
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold ${
                    isAuthenticated
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {isAuthenticated ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    "1"
                  )}
                </span>
                <div>
                  <CardTitle>Authenticate</CardTitle>
                  <CardDescription>
                    {isAuthenticated ? "Signed in" : "Connect your account"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessionPending ? (
                <div className="flex items-center gap-2.5 rounded-md border bg-muted/50 px-3 py-3 text-[13px] tracking-tight text-muted-foreground">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-muted-foreground/30 border-t-muted-foreground" />
                  Checking session...
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-2.5">
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3.5 py-3 dark:border-emerald-900 dark:bg-emerald-950/50">
                    <p className="text-[11px] font-medium tracking-tight text-emerald-600 dark:text-emerald-400">
                      Signed in as
                    </p>
                    <p className="text-sm font-medium tracking-tight text-foreground">
                      {session?.user?.name ?? session?.user?.email ?? "User"}
                    </p>
                    {session?.user?.email && (
                      <p className="text-[12px] tracking-tight text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full"
                    disabled={isSigningOut}
                  >
                    <LogOut />
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialSignIn("google")}
                      disabled={isSigningIn || socialProvider !== null}
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
                      {socialProvider === "google"
                        ? "Connecting..."
                        : "Continue with Google"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialSignIn("github")}
                      disabled={isSigningIn || socialProvider !== null}
                    >
                      <Github className="h-4 w-4" />
                      {socialProvider === "github"
                        ? "Connecting..."
                        : "Continue with GitHub"}
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
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
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
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleSignIn}
                    className="w-full"
                    disabled={isSigningIn}
                  >
                    <Mail className="h-4 w-4" />
                    {isSigningIn ? "Signing in..." : "Sign in with Email"}
                  </Button>
                </div>
              )}
              {authMessage && authTone && (
                <div
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "relative overflow-hidden rounded-xl border px-3.5 py-3 shadow-sm transition-all",
                    "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1",
                    authTone === "success" &&
                      "bg-emerald-100 dark:bg-emerald-900",
                    authTone === "error" && "bg-rose-100 dark:bg-rose-900",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex shrink-0 items-center justify-center",
                        authTone === "success" &&
                          "border-emerald-200 bg-emerald-100/80 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
                        authTone === "error" &&
                          "border-rose-200 bg-rose-100/80 text-rose-700 dark:border-rose-800 dark:bg-rose-900/60 dark:text-rose-300",
                      )}
                    >
                      {authTone === "loading" ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : authTone === "success" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium tracking-tight">
                        {authMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2 — Export */}
          <Card
            className={`transition-opacity duration-300 ${
              isAuthenticated ? "" : "pointer-events-none opacity-40"
            }`}
          >
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
              <Button
                type="button"
                onClick={handleExport}
                disabled={isExporting || !isAuthenticated}
                className="w-full"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Download message.json"}
              </Button>

              {exportMessage && exportTone && (
                <div
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "relative overflow-hidden rounded-xl border px-3.5 py-3 shadow-sm transition-all",
                    "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1",
                    exportTone === "success" &&
                      "bg-emerald-100 dark:bg-emerald-900",
                    exportTone === "error" && "bg-rose-100 dark:bg-rose-900",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex shrink-0 items-center justify-center",
                        exportTone === "success" &&
                          "border-emerald-200 bg-emerald-100/80 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
                        exportTone === "error" &&
                          "border-rose-200 bg-rose-100/80 text-rose-700 dark:border-rose-800 dark:bg-rose-900/60 dark:text-rose-300",
                      )}
                    >
                      {exportTone === "loading" ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : exportTone === "success" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className=" min-w-0">
                      <p className="text-[13px] font-medium tracking-tight">
                        {exportMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
