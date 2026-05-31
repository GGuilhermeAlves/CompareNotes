import { NotebookData } from "@/types/notebook"

export const notebooksDB: NotebookData[] = [
  {
    id: 1,
    nome: "TUF F16",
    marca: "Asus",
    imagem: "/tuf-f16.png",
    specs: {
      processador: "Intel® Core™ i5-14450HX",
      placaDeVideo: "NVIDIA® GeForce RTX™ 5050 8 GB (115W)",
      ram: { capacidade: "8 GB", tipo: "DDR5", frequencia: "5600MT/s" },
      armazenamento: { capacidade: "512 GB", tipo: "SSD NVMe M.2 2280" },
      tela: {
        tamanho: '16"',
        painel: "IPS",
        resolucao: "FHD (1920x1080)",
        frequencia: "165Hz",
        cores: "100% sRGB",
        brilho: "250 nits"
      },
      conectividade: [
        { qtd: 2, tipo: "USB-A 3.2 Gen1", features: [] },
        { qtd: 1, tipo: "USB-C", features: ["TB4", "iGPU"] },
        { qtd: 1, tipo: "USB-C 3.2 Gen2", features: ["PD", "DP", "dGPU"] },
        { qtd: 1, tipo: "HDMI 2.1", features: ["dGPU"] },
        { qtd: 1, tipo: "RJ45", features: [] },
        { qtd: 1, tipo: "Audio 3.5mm", features: [] }
      ],
      teclado: "Retroiluminado RGB, ABNT2, com numérico",
      webcam: "FHD + Sensor IR",
      bateria: "90Wh (4 Células)",
      fonte: "280W",
      so: "Linux",
      peso: "2,20 kg",
      construcao: "Tampa de metal, resto em plástico"
    },
    dimensoes: { largura: 35.4, espessura: 2.5, profundidade: 25.1 }
  },
  {
    id: 2,
    nome: "Alienware Aurora",
    marca: "Dell",
    imagem: "/aurora-16.png",
    specs: {
      processador: "Intel® Core™ 5 210H",
      placaDeVideo: "NVIDIA® GeForce RTX™ 3050 6 GB",
      ram: { capacidade: "16 GB", tipo: "DDR5", frequencia: "5200MT/s" },
      armazenamento: { capacidade: "512 GB", tipo: "SSD NVMe M.2 2280" },
      tela: {
        tamanho: '16"',
        painel: "IPS",
        resolucao: "QHD (2560x1440)",
        frequencia: "120Hz",
        cores: "100% sRGB",
        brilho: "300 nits"
      },
      conectividade: [
        { qtd: 2, tipo: "USB-A 3.2 Gen1", features: [] },
        { qtd: 2, tipo: "USB-C 3.2 Gen2", features: ["PD", "iGPU"] },
        { qtd: 1, tipo: "HDMI 2.1", features: ["dGPU"] },
        { qtd: 1, tipo: "RJ45", features: [] },
        { qtd: 1, tipo: "Audio 3.5mm", features: [] }
      ],
      teclado: "Branco, ABNT2 Numérico",
      webcam: "HD (720p)",
      bateria: "60Wh (3 Células)",
      fonte: "130W",
      so: "Linux Ubuntu",
      peso: "2,49 kg",
      construcao: "Tampa de metal, resto em plástico"
    },
    dimensoes: { largura: 35.6, espessura: 2.8, profundidade: 28.9 }
  },
  {
    id: 3,
    nome: "Legion Slim 5i",
    marca: "Lenovo",
    imagem: "/legion-5i.png",
    specs: {
      processador: "Intel® Core™ i7-13700H",
      placaDeVideo: "NVIDIA® GeForce RTX™ 4060 8 GB (100W)",
      ram: { capacidade: "16 GB", tipo: "DDR5", frequencia: "5200MT/s" },
      armazenamento: { capacidade: "1 TB", tipo: "SSD NVMe M.2 2280" },
      tela: {
        tamanho: '16"',
        painel: "IPS",
        resolucao: "WQXGA (2560x1600)",
        frequencia: "165Hz",
        cores: "100% sRGB",
        brilho: "300 nits"
      },
      conectividade: [
        { qtd: 2, tipo: "USB-A 3.2 Gen2", features: [] },
        { qtd: 1, tipo: "USB-C 3.2 Gen2", features: ["PD", "DP", "dGPU"] },
        { qtd: 1, tipo: "USB-C 3.2 Gen2", features: ["DP", "iGPU"] },
        { qtd: 1, tipo: "HDMI 2.1", features: ["dGPU"] },
        { qtd: 1, tipo: "RJ45", features: [] },
        { qtd: 1, tipo: "Leitor SD", features: [] },
        { qtd: 1, tipo: "Audio 3.5mm", features: [] }
      ],
      teclado: "Branco, ABNT2 Numérico",
      webcam: "FHD (1080p)",
      bateria: "80Wh (4 Células)",
      fonte: "230W",
      so: "Windows 11 Home",
      peso: "2,40 kg",
      construcao: "Tampa de metal, resto em plástico"
    },
    dimensoes: { largura: 35.9, espessura: 2.1, profundidade: 26.0 }
  },
  {
    id: 4,
    nome: "MacBook Air M4",
    marca: "Apple",
    imagem: "/macbook-air-m4.png",
    specs: {
      processador: "Apple M4 (8-Core)",
      placaDeVideo: "Apple GPU (10-Core)",
      ram: { capacidade: "16 GB", tipo: "LPDDR5X", frequencia: "7500MT/s" },
      armazenamento: { capacidade: "512 GB", tipo: "SSD Integrado" },
      tela: {
        tamanho: '13.6"',
        painel: "IPS",
        resolucao: "QHD (2560x1664)",
        frequencia: "60Hz",
        cores: "100% DCI-P3",
        brilho: "500 Nits"
      },
      conectividade: [
        {
          qtd: 2,
          tipo: "USB-C / USB 4",
          features: ["TB4", "PD", "DP", "iGPU"]
        },
        { qtd: 1, tipo: "MagSafe 3", features: [] },
        { qtd: 1, tipo: "Audio 3.5mm", features: [] }
      ],
      teclado: "Retroiluminado branco, ANSI",
      webcam: "FHD 1080p",
      bateria: "52.6Wh",
      fonte: "35W",
      so: "macOS",
      peso: "1,24 kg",
      construcao: "Todo em metal"
    },
    dimensoes: { largura: 30.41, espessura: 1.1, profundidade: 21.5 }
  }
]

export const TODAS_MARCAS = Array.from(new Set(notebooksDB.map((n) => n.marca)))
export const TODOS_PROCESSADORES = Array.from(new Set(notebooksDB.map((n) => n.specs.processador)))
export const TODAS_GPUS = Array.from(new Set(notebooksDB.map((n) => n.specs.placaDeVideo)))
export const TODAS_RAM = Array.from(new Set(notebooksDB.map((n) => n.specs.ram.capacidade)))
export const TODOS_ARMAZ = Array.from(new Set(notebooksDB.map((n) => n.specs.armazenamento.capacidade)))
export const TODOS_TAMANHOS = Array.from(new Set(notebooksDB.map((n) => n.specs.tela.tamanho)))
export const TODAS_RESOLUCOES = Array.from(new Set(notebooksDB.map((n) => n.specs.tela.resolucao)))
export const TODAS_FREQUENCIAS = Array.from(new Set(notebooksDB.map((n) => n.specs.tela.frequencia)))
export const TODOS_PAINEIS = Array.from(new Set(notebooksDB.map((n) => n.specs.tela.painel)))
export const TODAS_FEATURES = Array.from(new Set(notebooksDB.flatMap((n) => n.specs.conectividade.flatMap((p) => p.features))))
