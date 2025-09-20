import { http } from "../http";

export interface AtendimentoSimulacao {
  id: number;
  parcela: number;
  coeficiente: number;
  valor_liberado: number;
  valor_liquido: number;
  liberado_cliente: number;
  created_at: string;
}

export interface Atendimento {
  id: number;
  cpf: string;
  matricula: string;
  banco: string;
  stage: string;
  owner_atendente?: number | null;
  assigned_to?: number | null;
  simulacao_status?: string;
  created_at: string;
  updated_at: string;
  simulacoes?: AtendimentoSimulacao[];
  latest_simulacao?: AtendimentoSimulacao;
}

export interface AtendimentoEvent {
  id: number;
  atendimento: number;
  event_type: string;
  user: number;
  note?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export interface AtendimentoCreateData {
  cpf: string;
  matricula: string;
  banco: string;
}

export interface AtendimentoFilters {
  stage?: string;
  owner_atendente?: number;
  banco?: string;
  cpf?: string;
  matricula?: string;
  page?: number;
  page_size?: number;
}

export class AtendimentosService {
  static async list(filters: AtendimentoFilters = {}): Promise<{
    count: number;
    next?: string;
    previous?: string;
    results: Atendimento[];
  }> {
    const response = await http.get("/atendimentos/", {
      params: filters,
    });
    const data = response.data;
    if (Array.isArray(data)) {
      return {
        count: data.length,
        results: data,
      };
    }
    return data;
  }

  static async get(id: number): Promise<Atendimento> {
    const response = await http.get(`/atendimentos/${id}/`);
    return response.data;
  }

  static async create(data: AtendimentoCreateData): Promise<Atendimento> {
    const response = await http.post("/atendimentos/", data);
    return response.data;
  }

  static async update(id: number, data: Partial<Atendimento>): Promise<Atendimento> {
    const response = await http.patch(`/atendimentos/${id}/`, data);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await http.delete(`/atendimentos/${id}/`);
  }

  static async claim(id: number): Promise<void> {
    await http.post(`/atendimentos/${id}/claim/`);
  }

  static async release(id: number): Promise<void> {
    await http.post(`/atendimentos/${id}/release/`);
  }

  static async forward(id: number, stage: string, note?: string): Promise<void> {
    await http.post(`/atendimentos/${id}/forward/`, { stage, note });
  }

  static async addNote(id: number, note: string): Promise<void> {
    await http.post(`/atendimentos/${id}/note/`, { note });
  }

  static async calculate(id: number, valor_liberado: number, taxa: number): Promise<void> {
    await http.post(`/atendimentos/${id}/calculate/`, { valor_liberado, taxa });
  }

  static async getEvents(id: number): Promise<AtendimentoEvent[]> {
    const response = await http.get(`/atendimentos/${id}/events/`);
    return response.data;
  }

  static async getQueueStats(): Promise<{
    esteira_global: number;
    atendente: number;
    calculista: number;
    gerente_fechamento: number;
    total: number;
  }> {
    const response = await http.get("/atendimentos/queue-stats/");
    return response.data;
  }

  static async exportCSV(filters: AtendimentoFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await http.get(`/atendimentos/export/?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  static async bulkImport(file: File): Promise<{
    imported: number;
    errors: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await http.post("/atendimentos/import/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}
