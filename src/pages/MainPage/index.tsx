import { useState, useEffect } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Bar,
} from "recharts";
import { monthNames } from "../../constants";
import { ChartDataItem, DisplayMode, MonthlyData, Product } from "../../interfaces";
import { Container, Graph, Filter, GraphContainer, Label, Text } from "./style";

const MainPage = () => {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("all");

  const handleDisplayModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayMode(event.target.value as DisplayMode);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        const products: Product[] = await response.json();

        const monthlyData: { [key: string]: MonthlyData } = {};

        products.forEach((item) => {
          if (!item.date || typeof item.date !== "string") return;

          try {
            const dateParts = item.date.split("/");
            if (dateParts.length !== 3) return;

            const [day, month, year] = dateParts;
            const monthIndex = parseInt(month) - 1;

            if (monthIndex < 0 || monthIndex >= monthNames.length) return;

            const monthKey = `${monthNames[monthIndex]}`;

            if (!monthlyData[monthKey]) {
              monthlyData[monthKey] = {
                factory1: { product1: 0, product2: 0 },
                factory2: { product1: 0, product2: 0 },
              };
            }

            if (item.factory_id === 1) {
              monthlyData[monthKey].factory1.product1 += item.product1 || 0;
              monthlyData[monthKey].factory1.product2 += item.product2 || 0;
            } else if (item.factory_id === 2) {
              monthlyData[monthKey].factory2.product1 += item.product1 || 0;
              monthlyData[monthKey].factory2.product2 += item.product2 || 0;
            }
          } catch (error) {
            console.warn("Ошибка при обработке элемента:", item, error);
          }
        });

        const chartData: ChartDataItem[] = Object.entries(monthlyData).map(
          ([month, factories]) => ({
            name: month,
            "Фабрика А (Product 1)": factories.factory1.product1 / 1000,
            "Фабрика А (Product 2)": factories.factory1.product2 / 1000,
            "Фабрика Б (Product 1)": factories.factory2.product1 / 1000,
            "Фабрика Б (Product 2)": factories.factory2.product2 / 1000,
          })
        );

        chartData.sort((a, b) => {
          return monthNames.indexOf(a.name) - monthNames.indexOf(b.name);
        });

        setData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getFilteredData = (): ChartDataItem[] => {
    if (displayMode === "all") {
      return data.map((item) => ({
        name: item.name,
        "Фабрика А":
          (item["Фабрика А (Product 1)"] || 0) +
          (item["Фабрика А (Product 2)"] || 0),
        "Фабрика Б":
          (item["Фабрика Б (Product 1)"] || 0) +
          (item["Фабрика Б (Product 2)"] || 0),
      }));
    } else if (displayMode === "product1") {
      return data.map((item) => ({
        name: item.name,
        "Фабрика А (Product 1)": item["Фабрика А (Product 1)"] || 0,
        "Фабрика Б (Product 1)": item["Фабрика Б (Product 1)"] || 0,
      }));
    } else {
      return data.map((item) => ({
        name: item.name,
        "Фабрика А (Product 2)": item["Фабрика А (Product 2)"] || 0,
        "Фабрика Б (Product 2)": item["Фабрика Б (Product 2)"] || 0,
      }));
    }
  };

  const filteredData = getFilteredData();

  return (
    <Container>
      <GraphContainer>
        <Filter>
          <Label>
            <Text>Фильтр по типу продукции </Text>
            <select value={displayMode} onChange={handleDisplayModeChange}>
              <option value="all">Все продукты</option>
              <option value="product1">Продукт 1</option>
              <option value="product2">Продукт 2</option>
            </select>
          </Label>
        </Filter>
        <Graph>
          <BarChart width={1150} height={600} data={filteredData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]} />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} т`, ""]}
            />
            <Legend />

            {displayMode === "all" ? (
              <>
                <Bar dataKey="Фабрика А" fill="#8884d8" />
                <Bar dataKey="Фабрика Б" fill="#ff7300" />
              </>
            ) : displayMode === "product1" ? (
              <>
                <Bar dataKey="Фабрика А (Product 1)" fill="#8884d8" />
                <Bar dataKey="Фабрика Б (Product 1)" fill="#ff7300" />
              </>
            ) : (
              <>
                <Bar dataKey="Фабрика А (Product 2)" fill="#82ca9d" />
                <Bar dataKey="Фабрика Б (Product 2)" fill="#ffc658" />
              </>
            )}
          </BarChart>
        </Graph>
      </GraphContainer>
    </Container>
  );
};

export default MainPage;
