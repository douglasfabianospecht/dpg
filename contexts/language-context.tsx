"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "pt" | "en" | "es"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  pt: {
    dashboard: "Dashboard",
    hotel: "Hotel",
    restaurant: "Restaurante",
    inventory: "Estoque",
    financial: "Financeiro",
    crm: "CRM",
    reports: "Relatórios",
    budget: "Budget",
    settings: "Configurações",
    occupancy_rate: "Taxa de Ocupação",
    revpar: "RevPAR",
    adr: "ADR",
    revenue: "Receita",
    goal: "Meta",
    vs_goal: "vs meta",
    room_status: "Situação dos Quartos",
    units_in_rental: "UHs na Locação",
    occupied: "Ocupada",
    available: "Disponível",
    cleaning: "Limpeza",
    maintenance: "Manutenção",
    checkin: "Checkin",
    checkout: "Checkout",
    people: "Pessoas",
    out_of_rental: "Fora Locação",
    owner: "Proprietário",
    daily_occupancy: "Ocupação Diária",
    all_establishments: "Todos os Estabelecimentos",
    today: "Hoje",
    search: "Buscar...",
    manager: "Manager",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    this_week: "Esta Semana",
    this_month: "Este Mês",
    this_year: "Este Ano",
    custom_period: "Outro Período",
    custom_period_message: "Funcionalidade de período personalizado em desenvolvimento.",
  },
  en: {
    dashboard: "Dashboard",
    hotel: "Hotel",
    restaurant: "Restaurant",
    inventory: "Inventory",
    financial: "Financial",
    crm: "CRM",
    reports: "Reports",
    budget: "Budget",
    settings: "Settings",
    occupancy_rate: "Occupancy Rate",
    revpar: "RevPAR",
    adr: "ADR",
    revenue: "Revenue",
    goal: "Goal",
    vs_goal: "vs goal",
    room_status: "Room Status",
    units_in_rental: "Units in Rental",
    occupied: "Occupied",
    available: "Available",
    cleaning: "Cleaning",
    maintenance: "Maintenance",
    checkin: "Checkin",
    checkout: "Checkout",
    people: "People",
    out_of_rental: "Out of Rental",
    owner: "Owner",
    daily_occupancy: "Daily Occupancy",
    all_establishments: "All Establishments",
    today: "Today",
    search: "Search...",
    manager: "Manager",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    this_week: "This Week",
    this_month: "This Month",
    this_year: "This Year",
    custom_period: "Custom Period",
    custom_period_message: "Custom period feature under development.",
  },
  es: {
    dashboard: "Dashboard",
    hotel: "Hotel",
    restaurant: "Restaurante",
    inventory: "Inventario",
    financial: "Financiero",
    crm: "CRM",
    reports: "Informes",
    budget: "Presupuesto",
    settings: "Configuraciones",
    occupancy_rate: "Tasa de Ocupación",
    revpar: "RevPAR",
    adr: "ADR",
    revenue: "Ingresos",
    goal: "Meta",
    vs_goal: "vs meta",
    room_status: "Estado de las Habitaciones",
    units_in_rental: "Unidades en Alquiler",
    occupied: "Ocupada",
    available: "Disponible",
    cleaning: "Limpieza",
    maintenance: "Mantenimiento",
    checkin: "Checkin",
    checkout: "Checkout",
    people: "Personas",
    out_of_rental: "Fuera de Alquiler",
    owner: "Propietario",
    daily_occupancy: "Ocupación Diaria",
    all_establishments: "Todos los Establecimientos",
    today: "Hoy",
    search: "Buscar...",
    manager: "Gerente",
    yesterday: "Ayer",
    tomorrow: "Mañana",
    this_week: "Esta Semana",
    this_month: "Este Mes",
    this_year: "Este Año",
    custom_period: "Otro Período",
    custom_period_message: "Funcionalidad de período personalizado en desarrollo.",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["pt", "en", "es"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["pt"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

