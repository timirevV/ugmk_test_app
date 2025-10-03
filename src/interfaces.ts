export interface Product {
  id: number;
  factory_id: number;
  date: string;
  product1?: number;
  product2?: number;
  product3?: number;
}

export interface MonthlyData {
  factory1: {
    product1: number;
    product2: number;
  };
  factory2: {
    product1: number;
    product2: number;
  };
}

export interface ChartDataItem {
  name: string;
  "Фабрика А (Product 1)"?: number;
  "Фабрика А (Product 2)"?: number;
  "Фабрика Б (Product 1)"?: number;
  "Фабрика Б (Product 2)"?: number;
  "Фабрика А"?: number;
  "Фабрика Б"?: number;
}

export type DisplayMode = "all" | "product1" | "product2";