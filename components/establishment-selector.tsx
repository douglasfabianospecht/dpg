"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building2, ChevronDown } from "lucide-react"

interface Establishment {
  id: string
  name: string
}

interface EstablishmentSelectorProps {
  establishments: Establishment[]
  selectedId: string
  onSelect: (id: string) => void
}

export function EstablishmentSelector({ establishments, selectedId, onSelect }: EstablishmentSelectorProps) {
  const { t } = useLanguage()
  const [selected, setSelected] = useState<Establishment | null>(
    establishments.find((est) => est.id === selectedId) || null,
  )

  const handleSelect = (establishment: Establishment) => {
    setSelected(establishment)
    onSelect(establishment.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Building2 className="mr-2 h-4 w-4" />
          {selected ? selected.name : t("all_establishments")}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={() => handleSelect({ id: "all", name: t("all_establishments") })}>
          {t("all_establishments")}
        </DropdownMenuItem>
        {establishments.map((establishment) => (
          <DropdownMenuItem key={establishment.id} onClick={() => handleSelect(establishment)}>
            {establishment.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

