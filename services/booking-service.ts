import { supabase } from "@/lib/supabase"

export interface BookingData {
  id: number
  idestabelecimento: number
  datareserva: string
  uhtipo: string
  datain: string
  dataout: string
  datacancelamento: string | null
  valorhospedagem: number
  uhtotal: number
  rntotal: number
  paxtotal: number
  paxchd: number
  idhospedagem: number
  origem: string
  origemcrs: string
  segmento: string
  titularhospedagem: string
  titularreserva: string
  tipohospedagem: string
  statushospedagem: string
  datahorasinc: string
}

export interface CheckInOutData {
  id: number
  name: string
  roomType: string
  guests: string
  checkIn: string
  checkOut: string
  hasAlert: boolean
}

/**
 * Serviço para interagir com a tabela booking
 */
export const BookingService = {
  /**
   * Busca todas as reservas
   */
  async getAll(): Promise<BookingData[]> {
    const { data, error } = await supabase.from("booking").select("*").order("datain", { ascending: true })

    if (error) {
      console.error("Erro ao buscar reservas:", error)
      throw error
    }

    return data || []
  },

  /**
   * Busca uma reserva específica pelo ID
   */
  async getById(id: number): Promise<BookingData | null> {
    const { data, error } = await supabase.from("booking").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar reserva com ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Busca reservas por estabelecimento
   */
  async getByEstabelecimento(idEstabelecimento: number): Promise<BookingData[]> {
    const { data, error } = await supabase
      .from("booking")
      .select("*")
      .eq("idestabelecimento", idEstabelecimento)
      .order("datain", { ascending: true })

    if (error) {
      console.error(`Erro ao buscar reservas para estabelecimento ${idEstabelecimento}:`, error)
      throw error
    }

    return data || []
  },

  /**
   * Busca reservas por período de check-in
   */
  async getByCheckInRange(startDate: string, endDate: string, idEstabelecimento?: number): Promise<BookingData[]> {
    let query = supabase
      .from("booking")
      .select("*")
      .gte("datain", startDate)
      .lte("datain", endDate)
      .order("datain", { ascending: true })

    if (idEstabelecimento && idEstabelecimento > 0) {
      query = query.eq("idestabelecimento", idEstabelecimento)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Erro ao buscar reservas para check-in entre ${startDate} e ${endDate}:`, error)
      throw error
    }

    return data || []
  },

  /**
   * Busca reservas por período de check-out
   */
  async getByCheckOutRange(startDate: string, endDate: string, idEstabelecimento?: number): Promise<BookingData[]> {
    let query = supabase
      .from("booking")
      .select("*")
      .gte("dataout", startDate)
      .lte("dataout", endDate)
      .order("dataout", { ascending: true })

    if (idEstabelecimento && idEstabelecimento > 0) {
      query = query.eq("idestabelecimento", idEstabelecimento)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Erro ao buscar reservas para check-out entre ${startDate} e ${endDate}:`, error)
      throw error
    }

    return data || []
  },

  /**
   * Busca check-ins para uma data específica
   */
  async getCheckInsForDate(date: string, idEstabelecimento?: number): Promise<CheckInOutData[]> {
    let query = supabase
      .from("booking")
      .select("*")
      .eq("datain", date)
      .is("datacancelamento", null)
      .order("titularhospedagem", { ascending: true })

    if (idEstabelecimento && idEstabelecimento > 0) {
      query = query.eq("idestabelecimento", idEstabelecimento)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Erro ao buscar check-ins para ${date}:`, error)
      throw error
    }

    return (data || []).map((booking) => ({
      id: booking.id,
      name: booking.titularhospedagem,
      roomType: booking.uhtipo,
      guests: `${booking.paxtotal} pax${booking.paxchd > 0 ? ` (${booking.paxchd} chd)` : ""}`,
      checkIn: new Date(booking.datain).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      checkOut: new Date(booking.dataout).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      hasAlert: false, // Pode ser implementado com base em regras de negócio
    }))
  },

  /**
   * Busca check-outs para uma data específica
   */
  async getCheckOutsForDate(date: string, idEstabelecimento?: number): Promise<CheckInOutData[]> {
    let query = supabase
      .from("booking")
      .select("*")
      .eq("dataout", date)
      .is("datacancelamento", null)
      .order("titularhospedagem", { ascending: true })

    if (idEstabelecimento && idEstabelecimento > 0) {
      query = query.eq("idestabelecimento", idEstabelecimento)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Erro ao buscar check-outs para ${date}:`, error)
      throw error
    }

    return (data || []).map((booking) => ({
      id: booking.id,
      name: booking.titularhospedagem,
      roomType: booking.uhtipo,
      guests: `${booking.paxtotal} pax${booking.paxchd > 0 ? ` (${booking.paxchd} chd)` : ""}`,
      checkIn: new Date(booking.datain).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      checkOut: new Date(booking.dataout).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      hasAlert: false, // Pode ser implementado com base em regras de negócio
    }))
  },

  /**
   * Busca previsão de ocupação para os próximos dias
   */
  async getForecastData(startDate: string, days: number, idEstabelecimento?: number): Promise<any[]> {
    // Primeiro, precisamos buscar as reservas para o período
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + days)
    const endDateStr = endDate.toISOString().split("T")[0]

    let query = supabase
      .from("booking")
      .select("*")
      .or(`datain.gte.${startDate},dataout.gte.${startDate}`)
      .lt("datain", endDateStr)
      .is("datacancelamento", null)

    if (idEstabelecimento && idEstabelecimento > 0) {
      query = query.eq("idestabelecimento", idEstabelecimento)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error(`Erro ao buscar previsão para ${days} dias a partir de ${startDate}:`, error)
      throw error
    }

    // Agora vamos calcular a ocupação para cada dia
    const forecast = []
    const currentDate = new Date(startDate)

    // Vamos assumir que temos 80 UHs disponíveis por dia (isso deve vir de outra tabela ou configuração)
    const totalUHs = 80

    for (let i = 0; i < days; i++) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const dateFormatted = currentDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })

      // Contar reservas ativas neste dia
      const activeBookings =
        bookings?.filter((booking) => {
          const checkIn = new Date(booking.datain)
          const checkOut = new Date(booking.dataout)
          return checkIn <= currentDate && checkOut > currentDate
        }) || []

      const uhsOcupadas = activeBookings.reduce((sum, booking) => sum + booking.uhtotal, 0)
      const taxaOcupacao = (uhsOcupadas / totalUHs) * 100

      // Calcular receita total para o dia
      const receitaDia = activeBookings.reduce((sum, booking) => {
        const checkIn = new Date(booking.datain)
        const checkOut = new Date(booking.dataout)
        const diasEstadia = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
        return sum + booking.valorhospedagem / diasEstadia
      }, 0)

      // Calcular ADR e RevPAR
      const adr = uhsOcupadas > 0 ? receitaDia / uhsOcupadas : 0
      const revpar = receitaDia / totalUHs

      // Contar hóspedes
      const paxTotal = activeBookings.reduce((sum, booking) => sum + booking.paxtotal, 0)
      const chdTotal = activeBookings.reduce((sum, booking) => sum + booking.paxchd, 0)

      forecast.push({
        date: dateFormatted,
        occupancy: taxaOcupacao.toFixed(2) + "%",
        uhsDisp: totalUHs,
        uhsOcup: uhsOcupadas,
        adr: Number.parseFloat(adr.toFixed(2)),
        revpar: Number.parseFloat(revpar.toFixed(2)),
        paxChd: `${paxTotal}/${chdTotal}`,
        receita: Number.parseFloat(receitaDia.toFixed(2)),
      })

      // Avançar para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return forecast
  },
}

