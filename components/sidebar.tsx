"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Building2,
  UtensilsCrossed,
  Package,
  Wallet,
  Users,
  FileText,
  PiggyBank,
  Settings,
  Globe,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()
  const { user } = useAuth()

  const routes = [
    {
      href: "/dashboard",
      icon: BarChart3,
      title: t("dashboard"),
    },
    {
      href: "/hotel",
      icon: Building2,
      title: t("hotel"),
    },
    {
      href: "/restaurant",
      icon: UtensilsCrossed,
      title: t("restaurant"),
    },
    {
      href: "/inventory",
      icon: Package,
      title: t("inventory"),
    },
    {
      href: "/financial",
      icon: Wallet,
      title: t("financial"),
    },
    {
      href: "/crm",
      icon: Users,
      title: t("crm"),
    },
    {
      href: "/reports",
      icon: FileText,
      title: t("reports"),
    },
    {
      href: "/budget",
      icon: PiggyBank,
      title: t("budget"),
    },
    {
      href: "/settings",
      icon: Settings,
      title: t("settings"),
    },
  ]

  return (
    <div className={cn("flex h-full w-64 flex-col bg-background", className)}>
      <div className="hidden h-14 items-center border-b px-4 lg:flex">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">HotelDash</h2>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 py-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.email?.split("@")[0] || "Usuário"}</span>
            <span className="text-xs text-muted-foreground">{t("manager")}</span>
          </div>
        </div>
        <div className="mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Globe className="mr-2 h-4 w-4" />
                {language === "pt" ? "Português" : language === "en" ? "English" : "Español"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setLanguage("pt")}>
                <span className="mr-2">🇧🇷</span> Português
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                <span className="mr-2">🇺🇸</span> English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("es")}>
                <span className="mr-2">🇪🇸</span> Español
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

