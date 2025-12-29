"use client";

import { Download, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-12">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
            deni ai migrator
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Message Migration
          </h1>
        </header>

        <div className="grid gap-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  1
                </span>
                <CardTitle className="text-lg">Sign in</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionPending ? (
                <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Checking session...
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-3">
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <p className="text-xs font-medium text-slate-500">
                      Signed in
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {session?.user?.name ?? session?.user?.email ?? "User"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {session?.user?.email ?? ""}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full"
                    disabled={isSigningOut}
                  >
                    <LogOut />
                    {isSigningOut ? "Signing..." : "Sign out"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialSignIn("google")}
                      disabled={isSigningIn || socialProvider !== null}
                    >
                      {socialProvider === "google"
                        ? "Signing..."
                        : "Continue with Google"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialSignIn("github")}
                      disabled={isSigningIn || socialProvider !== null}
                    >
                      {socialProvider === "github"
                        ? "Signing..."
                        : "Continue with GitHub"}
                    </Button>
                    <p className="text-xs text-slate-500">
                      or sign in with email
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <div className="space-y-1">
                      <label
                        htmlFor="login-email"
                        className="text-xs font-medium text-slate-600"
                      >
                        Email address
                      </label>
                      <Input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="login-password"
                        className="text-xs font-medium text-slate-600"
                      >
                        Password
                      </label>
                      <Input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="password"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleSignIn}
                    className="w-full"
                    size="lg"
                    disabled={isSigningIn}
                  >
                    <LogIn />
                    {isSigningIn ? "Signing..." : "Sign in"}
                  </Button>
                </div>
              )}
              {authMessage && (
                <Alert className="border-slate-200 bg-white">
                  <AlertTitle>Auth status</AlertTitle>
                  <AlertDescription className="text-slate-600">
                    {authMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card
            className={`border-slate-200 bg-white shadow-sm ${
              isAuthenticated ? "" : "opacity-60"
            }`}
          >
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  2
                </span>
                <CardTitle className="text-lg">Export</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                onClick={handleExport}
                disabled={isExporting || !isAuthenticated}
                size="lg"
                className="w-full"
              >
                <Download />
                {isExporting ? "Exporting..." : "Export"}
              </Button>

              {exportMessage && (
                <Alert className="border-slate-200 bg-white">
                  <AlertTitle>Export status</AlertTitle>
                  <AlertDescription className="text-slate-600">
                    {exportMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
