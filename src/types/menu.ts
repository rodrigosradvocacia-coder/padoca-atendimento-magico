export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: 'executivo' | 'adicional';
  description?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
}

export const MENU_ITEMS: MenuItem[] = [
  // Pratos Executivos
  { id: 1, name: "Filé de Frango", price: 15.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 2, name: "Lombo Suíno", price: 16.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 3, name: "Calabresa Acebolada", price: 17.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 4, name: "Omelete de Frios", price: 17.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 5, name: "Filé de Frango Empanado", price: 18.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 6, name: "Picadinho Carne com Legumes", price: 18.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 7, name: "Contra Filé", price: 19.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 8, name: "Filé de Tilápia", price: 21.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 9, name: "Parmegiana de Frango", price: 22.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 10, name: "Strogonoff de Frango", price: 23.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  { id: 11, name: "Parmegiana de Tilápia", price: 24.90, category: "executivo", description: "Acompanha arroz, feijão de caldo, salada, farofa e fritas" },
  
  // Adicionais
  { id: 12, name: "Feijão", price: 3.00, category: "adicional" },
  { id: 13, name: "Ovo", price: 3.00, category: "adicional" },
  { id: 14, name: "Arroz", price: 3.00, category: "adicional" },
  { id: 15, name: "Batata Frita", price: 5.00, category: "adicional" },
];