export interface PortInfo {
  qtd: number
  tipo: string
  features: string[]
}

export interface NotebookSpecs {
  processador: string
  placaDeVideo: string
  ram: { capacidade: string; tipo: string; frequencia: string }
  armazenamento: { capacidade: string; tipo: string }
  tela: {
    tamanho: string
    painel: string
    resolucao: string
    frequencia: string
    cores: string
    brilho: string
  }
  conectividade: PortInfo[]
  teclado: string
  webcam: string
  bateria: string
  fonte: string
  so: string
  peso: string
  construcao: string
}

export interface NotebookDimensions {
  largura: number
  espessura: number
  profundidade: number
}

export interface NotebookData {
  id: number
  nome: string
  marca: string
  imagem: string
  specs: NotebookSpecs
  dimensoes: NotebookDimensions
}

export interface PortRule {
  id: string
  baseType: string
  minQtd: number
  features: string[]
}
