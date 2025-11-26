"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UserCog, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user/getCurrentUser";

export default function Sidebar() {
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      setRole(user?.role ?? null);
    }
    load();
  }, []);

  const links = [
    {
      href: "/admin/estate",
      label: "Property Management",
      icon: Home,
    },
    {
      href: "/admin/agent",
      label: "Agent Management",
      icon: UserCog,
    },
    {
      href: "/admin/user",
      label: "User Management",
      icon: Users,
    },
  ];

  const filteredLinks =
    role === "agent"
      ? links.filter((l) => l.label === "Property Management")
      : links;

  if (role === null || role === "user") {
    return null;
  }

  return (
    <aside className="bg-background w-64 rounded-2xl border-r">
      <div className="p-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>

      <nav className="px-3">
        <ul className="flex flex-col gap-1">
          {filteredLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
