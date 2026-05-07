"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block">EduDiscover</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/colleges" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Colleges
            </Link>
            <Link href="/compare" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Compare
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          ) : session ? (
            <>
              <Link href="/dashboard/saved" className="text-sm font-medium hover:underline">
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
