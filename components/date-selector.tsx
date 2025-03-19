"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR, enUS, es } from "date-fns/locale"
import { CalendarIcon, ChevronDown } from "lucide-react"

interface DateSelectorProps {
  date: Date
  onSelect: (date: Date) => void
}

export function DateSelector({ date, onSelect }: DateSelectorProps) {
  const { t, language } = useLanguage()
  const [selected, setSelected] = useState<Date>(date)

  const locales = {
    pt: ptBR,
    en: enUS,
    es: es,
  }

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelected(date)
      onSelect(date)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP", { locale: locales[language] }) : <span>{t("today")}</span>}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={handleSelect} initialFocus locale={locales[language]} />
      </PopoverContent>
    </Popover>
  )
}

