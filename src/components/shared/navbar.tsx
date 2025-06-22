import Link from "next/link";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { House, User } from "lucide-react";
import { syncUser } from "@/actions/user.actions";

export default async function Navbar() {
  const user = await syncUser();
  return (
    <header className="sticky top-0 h-[9vh] bg-white dark:bg-accent z-50 backdrop-blur-md backdrop-brightness-50 supports-[backdrop-filter]: ">
      <nav className="flex h-full items-center justify-between Container">
        <Link className="text-2xl font-bold text-primary" href={"/"}>
          slyke
        </Link>

        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-1" href={"/"}>
            <House size={18} />
            <span className="hidden md:block text-sm">Home</span>
          </Link>
          <ModeToggle />

          <SignedIn>
            <div className="flex items-center gap-4">
              <Link
                className="flex items-center gap-1"
                href={`/profile/${user?.username}`}
              >
                <User size={18} />
                <span className="hidden md:block text-sm">Profile</span>
              </Link>
            </div>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <div className="px-4 py-1.5 bg-primary  rounded-md cursor-pointer text-white text-sm">
                sign in
              </div>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
