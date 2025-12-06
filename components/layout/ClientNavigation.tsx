"use client";

import Link from "next/link";
import Image from "next/image";
import { CgMenu } from "react-icons/cg";
import { User } from "@/db/types";
import UserMenu from "./userMenu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ClientNavigation({ user }: { user: User | null }) {
  return (
    <header className="flex items-center justify-between px-10 py-4 2xl:px-20 2xl:py-5">
      <Link href="/">
        <Image
          src="/logo_small.webp"
          alt="At Home logo"
          width={138}
          height={123}
        />
      </Link>

      {/* --- MOBILE --- */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <button className="text-brand-10 h-8 w-8">
            <CgMenu className="h-full w-full" />
          </button>
        </SheetTrigger>

        {/* --- MOBILE MENU CONTENT --- */}
        <SheetContent
          side="right"
          className="flex h-full flex-col justify-between px-6 py-10 text-lg"
        >
          {/* HEADER */}
          <div>
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
            </SheetHeader>

            {/* MAIN NAVIGATION */}
            <nav className="flex flex-col gap-4">
              {(user?.role === "admin" || user?.role === "agent") && (
                <Link
                  href="/admin/estate"
                  className="hover:text-brand-6 transition"
                >
                  Admin
                </Link>
              )}

              {user?.role === "user" && (
                <Link
                  href="/estate/add"
                  className="hover:text-brand-6 transition"
                >
                  Sell With Us
                </Link>
              )}

              {user && (
                <>
                  <Link
                    href="/profile/saved"
                    className="hover:text-brand-6 transition"
                  >
                    Saved
                  </Link>

                  <UserMenu user={user} />
                </>
              )}

              {!user && (
                <Link href="/login" className="hover:text-brand-6 transition">
                  Log in
                </Link>
              )}
            </nav>
          </div>

          {/* FOOTER BUTTON */}
          {!user && (
            <Link
              href="/login"
              className="text-brand-1 bg-brand-6 hover:bg-brand-5 rounded-lg py-3 text-center font-semibold transition-colors"
            >
              Log in
            </Link>
          )}
        </SheetContent>
      </Sheet>

      {/* --- DESKTOP MENU --- */}
      <ul className="text-h5 hidden list-none gap-7 font-bold md:flex 2xl:gap-20">
        {(user?.role === "admin" || user?.role === "agent") && (
          <li className="duration-300 hover:-translate-y-1">
            <Link href="/admin/estate">Admin</Link>
          </li>
        )}

        {user?.role === "user" && (
          <li className="duration-300 hover:-translate-y-1">
            <Link href="/estate/add">Sell With Us</Link>
          </li>
        )}

        {user && (
          <>
            <li className="duration-300 hover:-translate-y-1">
              <Link href="/profile/saved">Saved</Link>
            </li>

            <li className="cursor-pointer">
              <UserMenu user={user} />
            </li>
          </>
        )}

        {!user && (
          <li className="duration-300 hover:-translate-y-1">
            <Link
              href="/login"
              className="text-brand-1 bg-brand-6 hover:bg-brand-5 rounded-lg px-4 py-2 duration-300 hover:text-white"
            >
              Log in
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
}
