import { supabase } from "@/lib/supabase"

export interface Estabelecimento {
  id: number
  nome: string
}

/**
 * Serviço para interagir com a tabela estabelecimento
 */
export const EstabelecimentoService = {
  /**
   * Busca todos os estabelecimentos
   */
  async getAll(): Promise<Estabelecimento[]> {
    const { data, error } = await supabase.from("estabelecimento").select("*").order("nome", { ascending: true })

    if (error) {
      console.error("Erro ao buscar estabelecimentos:", error)
      throw error
    }

    return data || []
  },

  /**
   * Busca um estabelecimento específico pelo ID
   */
  async getById(id: number): Promise<Estabelecimento | null> {
    const { data, error } = await supabase.from("estabelecimento").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar estabelecimento com ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Busca estabelecimentos por nome (pesquisa parcial)
   */
  async searchByName(name: string): Promise<Estabelecimento[]> {
    const { data, error } = await supabase
      .from("estabelecimento")
      .select("*")
      .ilike("nome", `%${name}%`)
      .order("nome", { ascending: true })

    if (error) {
      console.error(`Erro ao buscar estabelecimentos com nome contendo "${name}":`, error)
      throw error
    }

    return data || []
  },

  /**
   * Cria um novo estabelecimento
   */
  async create(nome: string): Promise<Estabelecimento> {
    const { data, error } = await supabase.from("estabelecimento").insert([{ nome }]).select().single()

    if (error) {
      console.error(`Erro ao criar estabelecimento "${nome}":`, error)
      throw error
    }

    return data
  },

  /**
   * Atualiza um estabelecimento existente
   */
  async update(id: number, nome: string): Promise<Estabelecimento> {
    const { data, error } = await supabase.from("estabelecimento").update({ nome }).eq("id", id).select().single()

    if (error) {
      console.error(`Erro ao atualizar estabelecimento ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Remove um estabelecimento
   */
  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("estabelecimento").delete().eq("id", id)

    if (error) {
      console.error(`Erro ao excluir estabelecimento ${id}:`, error)
      throw error
    }
  },

  /**
   * Formata a lista de estabelecimentos para uso em componentes de seleção
   */
  formatForSelect(estabelecimentos: Estabelecimento[]): { id: string; name: string }[] {
    return estabelecimentos.map((est) => ({
      id: est.id.toString(),
      name: est.nome,
    }))
  },
}

