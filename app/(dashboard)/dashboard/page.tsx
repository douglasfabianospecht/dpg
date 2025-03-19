"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  BedDouble,
  DollarSign,
  BarChart3,
  RefreshCw,
  Share2,
  Building2,
  CalendarIcon,
  ChevronDown,
  User,
  Brush,
  Wrench,
  LogIn,
  LogOut,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, addDays, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { RDSService, type RDSMetrics, type OccupancyChartData } from "@/services/rds-service"
import { BookingService, type CheckInOutData } from "@/services/booking-service"
import { EstabelecimentoService } from "@/services/estabelecimento-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Interface estendida para incluir mais detalhes da reserva
interface ReservationDetails extends CheckInOutData {
  idHospedagem?: string
  dataReserva?: string
  titularReserva?: string
  titularHospedagem?: string
  tipoUH?: string
  tipoHospedagem?: string
  totalPax?: number
  criancas?: number
  valor?: number
  status?: string
  origemCRS?: string
  segmento?: string
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("checkins")
  const [activeForecastTab, setActiveForecastTab] = useState("days")
  const [isLoading, setIsLoading] = useState(true)
  const [estabelecimentos, setEstabelecimentos] = useState<{ id: string; name: string }[]>([])
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState("all")
  const [selectedReservation, setSelectedReservation] = useState<ReservationDetails | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Estados para dados do dashboard
  const [dashboardMetrics, setDashboardMetrics] = useState<RDSMetrics | null>(null)
  const [occupancyData, setOccupancyData] = useState<OccupancyChartData[]>([])
  const [checkIns, setCheckIns] = useState<CheckInOutData[]>([])
  const [checkOuts, setCheckOuts] = useState<CheckInOutData[]>([])
  const [forecastData, setForecastData] = useState<any[]>([])

  // Carregar estabelecimentos
  useEffect(() => {
    const loadEstabelecimentos = async () => {
      try {
        const data = await EstabelecimentoService.getAll()
        setEstabelecimentos(EstabelecimentoService.formatForSelect(data))
      } catch (error) {
        console.error("Erro ao carregar estabelecimentos:", error)
      }
    }

    loadEstabelecimentos()
  }, [])

  // Carregar dados do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd")
        const idEstabelecimento =
          selectedEstabelecimento !== "all" ? Number.parseInt(selectedEstabelecimento) : undefined

        // Carregar métricas do dashboard
        const metrics = await RDSService.getDashboardData(dateStr, idEstabelecimento)
        setDashboardMetrics(metrics)

        // Carregar dados do gráfico de ocupação
        const startDate = format(subDays(selectedDate, 7), "yyyy-MM-dd")
        const endDate = format(addDays(selectedDate, 7), "yyyy-MM-dd")
        const occupancy = await RDSService.getOccupancyChartData(startDate, endDate, idEstabelecimento)
        setOccupancyData(occupancy)

        // Carregar check-ins e check-outs
        const checkInsData = await BookingService.getCheckInsForDate(dateStr, idEstabelecimento)
        const checkOutsData = await BookingService.getCheckOutsForDate(dateStr, idEstabelecimento)
        setCheckIns(checkInsData)
        setCheckOuts(checkOutsData)

        // Carregar previsão
        const forecast = await BookingService.getForecastData(dateStr, 8, idEstabelecimento)
        setForecastData(forecast)
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [selectedDate, selectedEstabelecimento])

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const idEstabelecimento = selectedEstabelecimento !== "all" ? Number.parseInt(selectedEstabelecimento) : undefined

      // Recarregar todos os dados
      const metrics = await RDSService.getDashboardData(dateStr, idEstabelecimento)
      setDashboardMetrics(metrics)

      const startDate = format(subDays(selectedDate, 7), "yyyy-MM-dd")
      const endDate = format(addDays(selectedDate, 7), "yyyy-MM-dd")
      const occupancy = await RDSService.getOccupancyChartData(startDate, endDate, idEstabelecimento)
      setOccupancyData(occupancy)

      const checkInsData = await BookingService.getCheckInsForDate(dateStr, idEstabelecimento)
      const checkOutsData = await BookingService.getCheckOutsForDate(dateStr, idEstabelecimento)
      setCheckIns(checkInsData)
      setCheckOuts(checkOutsData)

      const forecast = await BookingService.getForecastData(dateStr, 8, idEstabelecimento)
      setForecastData(forecast)
    } catch (error) {
      console.error("Erro ao atualizar dados do dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para renderizar o ícone de status do quarto
  const getRoomStatusIcon = (status: string) => {
    switch (status) {
      case "occupied":
        return <BedDouble className="h-4 w-4" />
      case "available":
        return <span className="flex h-4 w-4 items-center justify-center">✓</span>
      case "cleaning":
        return <Brush className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "checkin":
        return <LogIn className="h-4 w-4" />
      case "checkout":
        return <LogOut className="h-4 w-4" />
      default:
        return <BedDouble className="h-4 w-4" />
    }
  }

  // Função para mostrar detalhes da reserva
  const showReservationDetails = (reservation: CheckInOutData) => {
    // Aqui normalmente buscaríamos mais detalhes da reserva da API
    // Para este exemplo, vamos criar dados fictícios
    const details: ReservationDetails = {
      ...reservation,
      idHospedagem: `${Math.floor(Math.random() * 1000)}`,
      dataReserva: format(subDays(new Date(), Math.floor(Math.random() * 30)), "dd/MM/yyyy"),
      titularReserva: reservation.name,
      titularHospedagem: Math.random() > 0.5 ? reservation.name : "Maria Oliveira",
      tipoUH: reservation.roomType,
      tipoHospedagem: Math.random() > 0.5 ? "Longa Estadia" : "Corporativa",
      totalPax: Number.parseInt(reservation.guests.split(" ")[0]),
      criancas: reservation.guests.includes("chd")
        ? Number.parseInt(reservation.guests.split("(")[1].split(" ")[0])
        : 0,
      valor: Math.floor(Math.random() * 5000) + 1000,
      status: Math.random() > 0.8 ? "Cancelada" : "Confirmada",
      origemCRS: Math.random() > 0.5 ? "Aplicativo" : "Website",
      segmento: Math.random() > 0.5 ? "Negócios" : "Lazer",
    }

    setSelectedReservation(details)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex h-9 items-center gap-2 text-sm">
                <Building2 className="h-4 w-4" />
                <span className="max-w-[120px] truncate sm:max-w-[150px]">
                  {selectedEstabelecimento === "all"
                    ? "Todos os Estabelecimentos"
                    : estabelecimentos.find((e) => e.id === selectedEstabelecimento)?.name || "Selecione"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <div className="p-2">
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted"
                  onClick={() => setSelectedEstabelecimento("all")}
                >
                  Todos os Estabelecimentos
                </div>
                {estabelecimentos.map((est) => (
                  <div
                    key={est.id}
                    className="cursor-pointer rounded-md p-2 hover:bg-muted"
                    onClick={() => setSelectedEstabelecimento(est.id)}
                  >
                    {est.name}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex h-9 items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span>{format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <div className="p-2">
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted"
                  onClick={() => setSelectedDate(new Date())}
                >
                  {t("today")}
                </div>
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted"
                  onClick={() => setSelectedDate(subDays(new Date(), 1))}
                >
                  {t("yesterday")}
                </div>
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted"
                  onClick={() => setSelectedDate(addDays(new Date(), 1))}
                >
                  {t("tomorrow")}
                </div>
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted"
                  onClick={() => {
                    // Início da semana (domingo)
                    const today = new Date()
                    const day = today.getDay()
                    const diff = today.getDate() - day
                    setSelectedDate(new Date(today.setDate(diff)))
                  }}
                >
                  {t("this_week")}
                </div>
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted"
                  onClick={() => {
                    // Primeiro dia do mês
                    const today = new Date()
                    setSelectedDate(new Date(today.getFullYear(), today.getMonth(), 1))
                  }}
                >
                  {t("this_month")}
                </div>
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted"
                  onClick={() => {
                    // Primeiro dia do ano
                    const today = new Date()
                    setSelectedDate(new Date(today.getFullYear(), 0, 1))
                  }}
                >
                  {t("this_year")}
                </div>
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted"
                  onClick={() => {
                    // Aqui você pode implementar um seletor de período personalizado
                    // Por enquanto, apenas mostra um alerta
                    alert(t("custom_period_message"))
                  }}
                >
                  {t("custom_period")}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button size="icon" variant="outline" className="h-9 w-9" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Button size="icon" variant="outline" className="h-9 w-9">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        {/* Taxa de Ocupação */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <Skeleton className="mb-1 h-8 w-16" />
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="mb-2 h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Taxa de Ocupação</div>
                  <BedDouble className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold">
                  {dashboardMetrics ? `${dashboardMetrics.taxaOcupacao.toFixed(0)}%` : "0%"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Meta: 65.00%</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${Math.min(dashboardMetrics?.taxaOcupacao || 0, 100)}%` }}
                  ></div>
                </div>
                {dashboardMetrics && (
                  <div
                    className={cn(
                      "mt-2 flex items-center text-xs",
                      dashboardMetrics.taxaOcupacao > 65 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    <span className="mr-1">{dashboardMetrics.taxaOcupacao > 65 ? "↑" : "↓"}</span>
                    {Math.abs(((dashboardMetrics.taxaOcupacao - 65) / 65) * 100).toFixed(1)}% vs meta
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* RevPAR */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <Skeleton className="mb-1 h-8 w-16" />
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="mb-2 h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">RevPAR</div>
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold">
                  {dashboardMetrics ? dashboardMetrics.revpar.toFixed(2) : "0.00"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Meta: 45.00</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${Math.min(((dashboardMetrics?.revpar || 0) / 100) * 100, 100)}%` }}
                  ></div>
                </div>
                {dashboardMetrics && (
                  <div
                    className={cn(
                      "mt-2 flex items-center text-xs",
                      dashboardMetrics.revpar > 45 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    <span className="mr-1">{dashboardMetrics.revpar > 45 ? "↑" : "↓"}</span>
                    {Math.abs(((dashboardMetrics.revpar - 45) / 45) * 100).toFixed(1)}% vs meta
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ADR */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <Skeleton className="mb-1 h-8 w-16" />
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="mb-2 h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">ADR</div>
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold">{dashboardMetrics ? dashboardMetrics.adr.toFixed(2) : "0.00"}</div>
                <div className="mt-1 text-xs text-muted-foreground">Meta: 45.00</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${Math.min(((dashboardMetrics?.adr || 0) / 150) * 100, 100)}%` }}
                  ></div>
                </div>
                {dashboardMetrics && (
                  <div
                    className={cn(
                      "mt-2 flex items-center text-xs",
                      dashboardMetrics.adr > 45 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    <span className="mr-1">{dashboardMetrics.adr > 45 ? "↑" : "↓"}</span>
                    {Math.abs(((dashboardMetrics.adr - 45) / 45) * 100).toFixed(1)}% vs meta
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receita */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <Skeleton className="mb-1 h-8 w-16" />
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="mb-2 h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Receita</div>
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold">
                  {dashboardMetrics
                    ? dashboardMetrics.receita.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0,00"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Meta: 30000.00</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${Math.min(((dashboardMetrics?.receita || 0) / 50000) * 100, 100)}%` }}
                  ></div>
                </div>
                {dashboardMetrics && (
                  <div
                    className={cn(
                      "mt-2 flex items-center text-xs",
                      dashboardMetrics.receita > 30000 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    <span className="mr-1">{dashboardMetrics.receita > 30000 ? "↑" : "↓"}</span>
                    {Math.abs(((dashboardMetrics.receita - 30000) / 30000) * 100).toFixed(1)}% vs meta
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Room Status and Occupancy Chart */}
      <div className="grid gap-2 lg:grid-cols-2">
        {/* Room Status */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <Skeleton className="mb-4 h-6 w-40" />
                <Skeleton className="mb-4 h-10 w-full rounded-md" />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-3 text-xl font-semibold">Situação dos Quartos</div>
                <div className="mb-3 rounded-md bg-muted/30 p-2 text-center">
                  {dashboardMetrics ? `${dashboardMetrics.totalUhs} UHs na Locação` : "Carregando..."}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {/* Ocupada */}
                  <div className="rounded-lg bg-red-100 p-3 transition-transform duration-200 hover:scale-105">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center text-red-600">
                        <BedDouble className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Ocupada</span>
                      </div>
                      <span className="text-xs text-red-600">
                        {dashboardMetrics
                          ? `${((dashboardMetrics.uhOcupada / dashboardMetrics.totalUhs) * 100).toFixed(0)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="text-center text-3xl font-bold text-red-600">
                      {dashboardMetrics?.uhOcupada || 0}
                    </div>
                  </div>

                  {/* Disponível */}
                  <div className="rounded-lg bg-green-100 p-3 transition-transform duration-200 hover:scale-105">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center text-green-600">
                        <div className="mr-2 flex h-4 w-4 items-center justify-center">✓</div>
                        <span className="text-sm font-medium">Disponível</span>
                      </div>
                      <span className="text-xs text-green-600">
                        {dashboardMetrics
                          ? `${((dashboardMetrics.uhDisponivel / dashboardMetrics.totalUhs) * 100).toFixed(0)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="text-center text-3xl font-bold text-green-600">
                      {dashboardMetrics?.uhDisponivel || 0}
                    </div>
                  </div>

                  {/* Limpeza */}
                  <div className="rounded-lg bg-yellow-100 p-3 transition-transform duration-200 hover:scale-105">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center text-yellow-600">
                        <Brush className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Limpeza</span>
                      </div>
                      <span className="text-xs text-yellow-600">
                        {dashboardMetrics
                          ? `${((dashboardMetrics.uhLimpeza / dashboardMetrics.totalUhs) * 100).toFixed(0)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="text-center text-3xl font-bold text-yellow-600">
                      {dashboardMetrics?.uhLimpeza || 0}
                    </div>
                  </div>

                  {/* Manutenção */}
                  <div className="rounded-lg bg-blue-100 p-3 transition-transform duration-200 hover:scale-105">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center text-blue-600">
                        <Wrench className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Manutenção</span>
                      </div>
                      <span className="text-xs text-blue-600">
                        {dashboardMetrics
                          ? `${((dashboardMetrics.uhManutencao / dashboardMetrics.totalUhs) * 100).toFixed(0)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="text-center text-3xl font-bold text-blue-600">
                      {dashboardMetrics?.uhManutencao || 0}
                    </div>
                  </div>

                  {/* Checkin */}
                  <div className="rounded-lg bg-purple-100 p-3 transition-transform duration-200 hover:scale-105">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center text-purple-600">
                        <LogIn className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Checkin</span>
                      </div>
                    </div>
                    <div className="text-center text-3xl font-bold text-purple-600">
                      {`${dashboardMetrics?.uhCheckin || 0}|${checkIns.length || 0}`}
                    </div>
                  </div>

                  {/* Checkout */}
                  <div className="rounded-lg bg-orange-100 p-3 transition-transform duration-200 hover:scale-105">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center text-orange-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Checkout</span>
                      </div>
                    </div>
                    <div className="text-center text-3xl font-bold text-orange-600">
                      {`${dashboardMetrics?.uhCheckout || 0}|${checkOuts.length || 0}`}
                    </div>
                  </div>

                  {/* Pessoas */}
                  <div className="rounded-lg bg-indigo-100 p-3 transition-transform duration-200 hover:scale-105">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center text-indigo-600">
                        <User className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Pessoas</span>
                      </div>
                    </div>
                    <div className="text-center text-3xl font-bold text-indigo-600">
                      {dashboardMetrics?.uhPessoas || 0}|0
                    </div>
                  </div>

                  {/* Fora Locação */}
                  <div className="rounded-lg bg-cyan-100 p-3 transition-transform duration-200 hover:scale-105">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center text-cyan-600">
                        <Building2 className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Fora Locação</span>
                      </div>
                    </div>
                    <div className="text-center text-3xl font-bold text-cyan-600">
                      {dashboardMetrics?.uhForaLocacao || 0}
                    </div>
                  </div>

                  {/* Proprietário */}
                  <div className="rounded-lg bg-pink-100 p-3 transition-transform duration-200 hover:scale-105">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center text-pink-600">
                        <User className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Proprietário</span>
                      </div>
                    </div>
                    <div className="text-center text-3xl font-bold text-pink-600">
                      {dashboardMetrics?.uhProprietario || 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4">
                <Skeleton className="mb-3 h-6 w-40" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-3 text-xl font-semibold">Ocupação Diária</div>
                <div className="relative h-[300px]">
                  {occupancyData.length > 0 ? (
                    <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="none">
                      {/* Eixo Y */}
                      <line x1="50" y1="20" x2="50" y2="250" stroke="#e5e7eb" strokeWidth="1" />
                      <text x="25" y="30" fontSize="12" textAnchor="middle" fill="#6b7280">
                        100%
                      </text>
                      <line x1="45" y1="30" x2="50" y2="30" stroke="#e5e7eb" strokeWidth="1" />

                      <text x="25" y="85" fontSize="12" textAnchor="middle" fill="#6b7280">
                        75%
                      </text>
                      <line x1="45" y1="85" x2="50" y2="85" stroke="#e5e7eb" strokeWidth="1" />

                      <text x="25" y="140" fontSize="12" textAnchor="middle" fill="#6b7280">
                        50%
                      </text>
                      <line x1="45" y1="140" x2="50" y2="140" stroke="#e5e7eb" strokeWidth="1" />

                      <text x="25" y="195" fontSize="12" textAnchor="middle" fill="#6b7280">
                        25%
                      </text>
                      <line x1="45" y1="195" x2="50" y2="195" stroke="#e5e7eb" strokeWidth="1" />

                      <text x="25" y="250" fontSize="12" textAnchor="middle" fill="#6b7280">
                        0%
                      </text>
                      <line x1="45" y1="250" x2="50" y2="250" stroke="#e5e7eb" strokeWidth="1" />

                      {/* Eixo X */}
                      <line x1="50" y1="250" x2="480" y2="250" stroke="#e5e7eb" strokeWidth="1" />

                      {/* Datas no eixo X */}
                      {occupancyData.map((data, index) => {
                        const x = 50 + (430 / (occupancyData.length - 1)) * index
                        return (
                          <text
                            key={index}
                            x={x}
                            y="270"
                            fontSize="10"
                            textAnchor="middle"
                            fill="#6b7280"
                            transform={index % 2 !== 0 ? "rotate(45," + x + ",270)" : ""}
                          >
                            {data.date}
                          </text>
                        )
                      })}

                      {/*
                      <path
                        d="M50,250 L131.66666666666666,125 L213.33333333333334,187.5 L295,62.5 L376.6666666666667,187.5 L458.3333333333333,125"
                        stroke="#6366f1"
                        strokeWidth="2"
                        fill="none"
                      />
                      */}
                      {occupancyData.map((data, index) => {
                        const x = 50 + (430 / (occupancyData.length - 1)) * index
                        const y = 250 - (data.occupancy / 100) * 220 // Scale occupancy to fit within the chart height
                        return <circle key={index} cx={x} cy={y} r="3" fill="#6366f1" />
                      })}
                      {/* Linhas conectando os pontos */}
                      <path
                        d={occupancyData
                          .map((data, index) => {
                            const x = 50 + (430 / (occupancyData.length - 1)) * index
                            const y = 250 - (data.occupancy / 100) * 220
                            return `${index === 0 ? "M" : "L"}${x},${y}`
                          })
                          .join(" ")}
                        stroke="#6366f1"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  ) : (
                    <div>Nenhum dado de ocupação disponível.</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="checkins" className="space-y-4">
        <TabsList>
          <TabsTrigger
            value="checkins"
            className="flex-1 rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary data-[state=active]:bg-accent"
          >
            Check-ins Hoje
          </TabsTrigger>
          <TabsTrigger
            value="checkouts"
            className="flex-1 rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary"
          >
            Check-outs Hoje
          </TabsTrigger>
          <TabsTrigger
            value="forecast"
            className="flex-1 rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary data-[state=active]:bg-accent"
          >
            Previsão
          </TabsTrigger>
        </TabsList>

        {/* Check-ins */}
        <TabsContent value="checkins" className="space-y-2">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="mb-2 h-4 w-32" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="mb-3 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border rounded-md border">
              {checkIns.length > 0 ? (
                checkIns.map((checkin, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_150px] items-center gap-4 p-4"
                    onClick={() => showReservationDetails(checkin)}
                  >
                    <div>
                      <div className="font-semibold">{checkin.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Quarto {checkin.roomNumber} - {checkin.roomType}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {checkin.arrivalTime} - {checkin.departureTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      {getRoomStatusIcon(checkin.roomStatus)}
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">Nenhum check-in para hoje.</div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Check-outs */}
        <TabsContent value="checkouts" className="space-y-2">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="mb-2 h-4 w-32" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="mb-3 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border rounded-md border">
              {checkOuts.length > 0 ? (
                checkOuts.map((checkout, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_150px] items-center gap-4 p-4"
                    onClick={() => showReservationDetails(checkout)}
                  >
                    <div>
                      <div className="font-semibold">{checkout.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Quarto {checkout.roomNumber} - {checkout.roomType}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {checkout.arrivalTime} - {checkout.departureTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      {getRoomStatusIcon(checkout.roomStatus)}
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">Nenhum check-out para hoje.</div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Forecast */}
        <TabsContent value="forecast" className="space-y-2">
          <div className="mb-4 flex items-center space-x-2">
            <Button
              variant={activeForecastTab === "days" ? "default" : "outline"}
              onClick={() => setActiveForecastTab("days")}
            >
              Por Dias
            </Button>
            <Button
              variant={activeForecastTab === "weeks" ? "default" : "outline"}
              onClick={() => setActiveForecastTab("weeks")}
            >
              Por Semanas
            </Button>
          </div>

          {isLoading ? (
            <div className="p-4">
              <Skeleton className="mb-2 h-4 w-32" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="mb-3 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border rounded-md border">
              {forecastData.length > 0 ? (
                forecastData.map((forecast, index) => (
                  <div key={index} className="grid grid-cols-[1fr_150px] items-center gap-4 p-4">
                    <div>
                      <div className="font-semibold">Previsão para {forecast.date}</div>
                      <div className="text-sm text-muted-foreground">Ocupação: {forecast.ocupacao}%</div>
                      {/* Adicione mais detalhes da previsão aqui */}
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">Nenhuma previsão disponível.</div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes da Reserva */}
      {isDetailsOpen && selectedReservation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Detalhes da Reserva</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome:</p>
                    <p className="text-gray-700">{selectedReservation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Quarto:</p>
                    <p className="text-gray-700">
                      {selectedReservation.roomNumber} ({selectedReservation.roomType})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-in:</p>
                    <p className="text-gray-700">{selectedReservation.arrivalTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-out:</p>
                    <p className="text-gray-700">{selectedReservation.departureTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hóspedes:</p>
                    <p className="text-gray-700">{selectedReservation.guests}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status:</p>
                    <p className="text-gray-700">{selectedReservation.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID Hospedagem:</p>
                    <p className="text-gray-700">{selectedReservation.idHospedagem}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data da Reserva:</p>
                    <p className="text-gray-700">{selectedReservation.dataReserva}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Titular da Reserva:</p>
                    <p className="text-gray-700">{selectedReservation.titularReserva}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Titular da Hospedagem:</p>
                    <p className="text-gray-700">{selectedReservation.titularHospedagem}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo de UH:</p>
                    <p className="text-gray-700">{selectedReservation.tipoUH}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo de Hospedagem:</p>
                    <p className="text-gray-700">{selectedReservation.tipoHospedagem}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Pax:</p>
                    <p className="text-gray-700">{selectedReservation.totalPax}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Crianças:</p>
                    <p className="text-gray-700">{selectedReservation.criancas}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Valor:</p>
                    <p className="text-gray-700">
                      {selectedReservation.valor?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Origem CRS:</p>
                    <p className="text-gray-700">{selectedReservation.origemCRS}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Segmento:</p>
                    <p className="text-gray-700">{selectedReservation.segmento}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

