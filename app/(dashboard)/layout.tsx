"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Menu, X, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Fechar o menu móvel quando a rota mudar
  useEffect(() => {
    setIsMobileOpen(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header para dispositivos móveis */}
      <div className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 lg:hidden">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => setIsMobileOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <span className="font-semibold">HotelDash</span>
        </div>
      </div>

      {/* Menu lateral para dispositivos móveis */}
      {isMounted && (
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex h-14 items-center border-b px-4">
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => setIsMobileOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Fechar menu</span>
              </Button>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="font-semibold">HotelDash</span>
              </div>
            </div>
            <Sidebar className="hidden-scrollbar h-[calc(100vh-3.5rem)] overflow-y-auto" />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar para desktop */}
        <Sidebar className="hidden border-r lg:block" />

        {/* Conteúdo principal */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto bg-muted/40 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

