import { ChartDataItem, DisplayMode } from "../interfaces";

export const getFilteredData = (
  data: ChartDataItem[],
  displayMode: DisplayMode
): ChartDataItem[] => {
  switch (displayMode) {
    case "all":
      return data.map((item) => ({
        name: item.name,
        "Фабрика А":
          (item["Фабрика А (Product 1)"] || 0) +
          (item["Фабрика А (Product 2)"] || 0),
        "Фабрика Б":
          (item["Фабрика Б (Product 1)"] || 0) +
          (item["Фабрика Б (Product 2)"] || 0),
      }));

    case "product1":
      return data.map((item) => ({
        name: item.name,
        "Фабрика А (Product 1)": item["Фабрика А (Product 1)"] || 0,
        "Фабрика Б (Product 1)": item["Фабрика Б (Product 1)"] || 0,
      }));

    case "product2":
      return data.map((item) => ({
        name: item.name,
        "Фабрика А (Product 2)": item["Фабрика А (Product 2)"] || 0,
        "Фабрика Б (Product 2)": item["Фабрика Б (Product 2)"] || 0,
      }));

    default:
      return data;
  }
};

export const getNiceTickStep = (maxValue: number): number => {
  if (maxValue <= 0) return 10;

  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const step = Math.ceil(maxValue / magnitude / 5) * magnitude / 2;

  return step;
};