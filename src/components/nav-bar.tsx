"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MessageCircle,
  Menu,
  BookmarkIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Chat",
      icon: <MessageCircle className="w-4 h-4 mr-2" />,
      active: pathname === "/" || pathname === "/chat",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard?tab=saved",
      label: "Saved Courses",
      icon: <BookmarkIcon className="w-4 h-4 mr-2" />,
      active: pathname === "/dashboard" && pathname.includes("tab=saved"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full navbar-gradient bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 mr-4">
          <Link
            href="/"
            className="font-semibold flex items-center group text-3xl"
          >
            <GraduationCap className="h-10 w-10 mr-2 text-primary group-hover:text-gradient-blue-green transition-all duration-300" />
            <span className="hidden sm:inline-block text-gradient-blue-green font-bold">
              Pathzy
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "default" : "ghost"}
              size="sm"
              className={`h-8 hover-gradient-effect ${
                route.active ? "bg-gradient-blue-teal text-white shadow-sm" : ""
              }`}
              asChild
            >
              <Link href={route.href} className="flex items-center">
                {route.icon}
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover-gradient-effect"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[280px] sm:w-[350px] p-0 border-l-[3px] border-gradient-blue-green">
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <SheetTitle className="text-left flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-gradient-blue-green font-bold">
                    Pathzy
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {routes.map((route) => (
                  <SheetClose asChild key={route.href}>
                    <Button
                      variant={route.active ? "default" : "ghost"}
                      className={`justify-start w-full hover-gradient-effect ${
                        route.active
                          ? "bg-gradient-blue-teal text-white shadow-sm"
                          : ""
                      }`}
                      onClick={() => setOpen(false)}
                      asChild
                    >
                      <Link href={route.href} className="flex items-center">
                        {route.icon}
                        {route.label}
                      </Link>
                    </Button>
                  </SheetClose>
                ))}

                <div className="mt-4 pt-4 border-t flex justify-center">
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}
