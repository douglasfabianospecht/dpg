import { supabase } from "@/lib/supabase"

export interface RDSData {
  id: number
  idestabelecimento: number
  datahospedagen: string
  uhlocacao: number
  uhocupada: number
  uhocupadaatual: number
  uhforalocacao: number
  uhproprietario: number
  uhintotal: number
  uhouttotal: number
  uhinefetuado: number
  uhoutefetuado: number
  uhlimpeza: number
  uhmanutencao: number
  paxintotal: number
  chdintotal: number
  paxtotal: number
  chdtotal: number
  paxinefetuado: number
  chdinefetuado: number
  receitahospedagem: number
  receitadiversos: number
  receitaaeb: number
  receitaeventos: number
  valorestorno: number
  valordesconto: number
  reservanova: number
  valorreservanova: number
  reservacancelada: number
  valorreservacancelada: number
  created_at: string
  updated_at: string
}

export interface RDSMetrics {
  taxaOcupacao: number
  revpar: number
  adr: number
  receita: number
  uhOcupada: number
  uhDisponivel: number
  uhLimpeza: number
  uhManutencao: number
  uhCheckin: number
  uhCheckout: number
  uhPessoas: number
  uhForaLocacao: number
  uhProprietario: number
  totalUhs: number
}

export interface OccupancyChartData {
  date: string
  occupancy: number
}

/**
 * Serviço para interagir com a tabela RDS (Revenue Data System)
 */
export const RDSService = {
  /**
   * Busca todos os registros da tabela RDS
   */
  async getAll(): Promise<RDSData[]> {
    const { data, error } = await supabase.from("rds").select("*").order("datahospedagen", { ascending: false })

    if (error) {
      console.error("Erro ao buscar dados RDS:", error)
      throw error
    }

    return data || []
  },

  /**
   * Busca um registro específico da tabela RDS pelo ID
   */
  async getById(id: number): Promise<RDSData | null> {
    const { data, error } = await supabase.from("rds").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar RDS com ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Busca registros da tabela RDS por estabelecimento
   */
  async getByEstabelecimento(idEstabelecimento: number): Promise<RDSData[]> {
    const { data, error } = await supabase
      .from("rds")
      .select("*")
      .eq("idestabelecimento", idEstabelecimento)
      .order("datahospedagen", { ascending: false })

    if (error) {
      console.error(`Erro ao buscar RDS para estabelecimento ${idEstabelecimento}:`, error)
      throw error
    }

    return data || []
  },

  /**
   * Busca registros da tabela RDS por período
   */
  async getByDateRange(startDate: string, endDate: string, idEstabelecimento?: number): Promise<RDSData[]> {
    let query = supabase
      .from("rds")
      .select("*")
      .gte("datahospedagen", startDate)
      .lte("datahospedagen", endDate)
      .order("datahospedagen", { ascending: true })

    if (idEstabelecimento && idEstabelecimento > 0) {
      query = query.eq("idestabelecimento", idEstabelecimento)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Erro ao buscar RDS para o período ${startDate} a ${endDate}:`, error)
      throw error
    }

    return data || []
  },

  /**
   * Busca dados para o dashboard para uma data específica
   */
  async getDashboardData(date: string, idEstabelecimento?: number): Promise<RDSMetrics | null> {
    let query = supabase.from("rds").select("*").eq("datahospedagen", date)

    if (idEstabelecimento && idEstabelecimento > 0) {
      query = query.eq("idestabelecimento", idEstabelecimento)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Erro ao buscar dados do dashboard para ${date}:`, error)
      throw error
    }

    if (!data || data.length === 0) {
      return null
    }

    // Se não foi especificado um estabelecimento, agregar os dados de todos os estabelecimentos
    if (!idEstabelecimento || idEstabelecimento <= 0) {
      const aggregatedData = data.reduce(
        (acc, curr) => {
          return {
            uhlocacao: acc.uhlocacao + curr.uhlocacao,
            uhocupada: acc.uhocupada + curr.uhocupada,
            uhocupadaatual: acc.uhocupadaatual + curr.uhocupadaatual,
            uhforalocacao: acc.uhforalocacao + curr.uhforalocacao,
            uhproprietario: acc.uhproprietario + curr.uhproprietario,
            uhintotal: acc.uhintotal + curr.uhintotal,
            uhouttotal: acc.uhouttotal + curr.uhouttotal,
            uhinefetuado: acc.uhinefetuado + curr.uhinefetuado,
            uhoutefetuado: acc.uhoutefetuado + curr.uhoutefetuado,
            uhlimpeza: acc.uhlimpeza + curr.uhlimpeza,
            uhmanutencao: acc.uhmanutencao + curr.uhmanutencao,
            paxintotal: acc.paxintotal + curr.paxintotal,
            chdintotal: acc.chdintotal + curr.chdintotal,
            paxtotal: acc.paxtotal + curr.paxtotal,
            chdtotal: acc.chdtotal + curr.chdtotal,
            receitahospedagem: acc.receitahospedagem + curr.receitahospedagem,
            receitadiversos: acc.receitadiversos + curr.receitadiversos,
            receitaaeb: acc.receitaaeb + curr.receitaaeb,
            receitaeventos: acc.receitaeventos + curr.receitaeventos,
          }
        },
        {
          uhlocacao: 0,
          uhocupada: 0,
          uhocupadaatual: 0,
          uhforalocacao: 0,
          uhproprietario: 0,
          uhintotal: 0,
          uhouttotal: 0,
          uhinefetuado: 0,
          uhoutefetuado: 0,
          uhlimpeza: 0,
          uhmanutencao: 0,
          paxintotal: 0,
          chdintotal: 0,
          paxtotal: 0,
          chdtotal: 0,
          receitahospedagem: 0,
          receitadiversos: 0,
          receitaaeb: 0,
          receitaeventos: 0,
        },
      )

      const totalUhs = aggregatedData.uhlocacao
      const taxaOcupacao = totalUhs > 0 ? (aggregatedData.uhocupada / totalUhs) * 100 : 0
      const receitaTotal =
        aggregatedData.receitahospedagem +
        aggregatedData.receitadiversos +
        aggregatedData.receitaaeb +
        aggregatedData.receitaeventos
      const adr = aggregatedData.uhocupada > 0 ? aggregatedData.receitahospedagem / aggregatedData.uhocupada : 0
      const revpar = totalUhs > 0 ? aggregatedData.receitahospedagem / totalUhs : 0

      return {
        taxaOcupacao,
        revpar,
        adr,
        receita: receitaTotal,
        uhOcupada: aggregatedData.uhocupada,
        uhDisponivel: totalUhs - aggregatedData.uhocupada - aggregatedData.uhlimpeza - aggregatedData.uhmanutencao,
        uhLimpeza: aggregatedData.uhlimpeza,
        uhManutencao: aggregatedData.uhmanutencao,
        uhCheckin: aggregatedData.uhintotal,
        uhCheckout: aggregatedData.uhouttotal,
        uhPessoas: aggregatedData.paxtotal,
        uhForaLocacao: aggregatedData.uhforalocacao,
        uhProprietario: aggregatedData.uhproprietario,
        totalUhs,
      }
    }

    // Dados de um único estabelecimento
    const rdsData = data[0]
    const totalUhs = rdsData.uhlocacao
    const taxaOcupacao = totalUhs > 0 ? (rdsData.uhocupada / totalUhs) * 100 : 0
    const receitaTotal =
      rdsData.receitahospedagem + rdsData.receitadiversos + rdsData.receitaaeb + rdsData.receitaeventos
    const adr = rdsData.uhocupada > 0 ? rdsData.receitahospedagem / rdsData.uhocupada : 0
    const revpar = totalUhs > 0 ? rdsData.receitahospedagem / totalUhs : 0

    return {
      taxaOcupacao,
      revpar,
      adr,
      receita: receitaTotal,
      uhOcupada: rdsData.uhocupada,
      uhDisponivel: totalUhs - rdsData.uhocupada - rdsData.uhlimpeza - rdsData.uhmanutencao,
      uhLimpeza: rdsData.uhlimpeza,
      uhManutencao: rdsData.uhmanutencao,
      uhCheckin: rdsData.uhintotal,
      uhCheckout: rdsData.uhouttotal,
      uhPessoas: rdsData.paxtotal,
      uhForaLocacao: rdsData.uhforalocacao,
      uhProprietario: rdsData.uhproprietario,
      totalUhs,
    }
  },

  /**
   * Busca dados para o gráfico de ocupação para um período
   */
  async getOccupancyChartData(
    startDate: string,
    endDate: string,
    idEstabelecimento?: number,
  ): Promise<OccupancyChartData[]> {
    const rdsData = await this.getByDateRange(startDate, endDate, idEstabelecimento)

    return rdsData.map((data) => {
      const taxaOcupacao = data.uhlocacao > 0 ? (data.uhocupada / data.uhlocacao) * 100 : 0
      return {
        date: new Date(data.datahospedagen).toLocaleDateString("pt-BR"),
        occupancy: Number.parseFloat(taxaOcupacao.toFixed(2)),
      }
    })
  },

  /**
   * Calcula métricas de desempenho comparando com metas
   */
  calculatePerformance(actual: number, goal: number): { percentChange: number; isPositive: boolean } {
    if (goal === 0) return { percentChange: 0, isPositive: false }

    const percentChange = ((actual - goal) / goal) * 100
    return {
      percentChange: Number.parseFloat(percentChange.toFixed(1)),
      isPositive: percentChange > 0,
    }
  },
}

