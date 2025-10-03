import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { monthNames } from "../../constants";
import {
  ChartDataItem,
  DisplayMode,
  MonthlyData,
  Product,
} from "../../interfaces";
import { Container, Graph, Filter, GraphContainer, Label, Text } from "./style";
import { getFilteredData, getNiceTickStep } from "../../utils/chartHelpers";

const MainPage = () => {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => {
    const saved = localStorage.getItem("displayMode");
    return (saved as DisplayMode) ?? "all";
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("displayMode", displayMode);
  }, [displayMode]);

  const handleDisplayModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayMode(event.target.value as DisplayMode);
  };

  const handleBarClick = (barData: any, factoryKey: string) => {
    const monthName = barData.name;
    const monthNumber = monthNames.indexOf(monthName) + 1;

    const fullEntry = data.find((d) => d.name === monthName);
    if (!fullEntry) return;

    let factoryId: number;
    let product1Sum = 0;
    let product2Sum = 0;

    if (factoryKey.includes("А")) {
      factoryId = 1;
      product1Sum = fullEntry["Фабрика А (Product 1)"] ?? 0;
      product2Sum = fullEntry["Фабрика А (Product 2)"] ?? 0;
    } else if (factoryKey.includes("Б")) {
      factoryId = 2;
      product1Sum = fullEntry["Фабрика Б (Product 1)"] ?? 0;
      product2Sum = fullEntry["Фабрика Б (Product 2)"] ?? 0;
    } else {
      return;
    }

    navigate(`/details/${factoryId}/${monthNumber}`, {
      state: { product1Sum, product2Sum },
    });
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

            const [, month] = dateParts;
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

  const filteredData = getFilteredData(data, displayMode);

  const maxValue = Math.max(
    ...filteredData.flatMap(
      (item) =>
        Object.values(item).filter((v) => typeof v === "number") as number[]
    )
  );

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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis
                domain={[0, Math.ceil(maxValue * 1.1)]}
                tickCount={6}
                tickFormatter={(value) => `${value}`}
                interval={0}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
                tickSize={5}
                ticks={Array.from(
                  {
                    length:
                      Math.ceil((maxValue * 1.1) / getNiceTickStep(maxValue)) +
                      1,
                  },
                  (_, i) => i * getNiceTickStep(maxValue)
                )}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)} т`, ""]}
              />
              <Legend />

              {displayMode === "all" ? (
                <>
                  <Bar
                    dataKey="Фабрика А"
                    fill="#0d00ff"
                    onClick={(data) => handleBarClick(data, "Фабрика А")}
                  />
                  <Bar
                    dataKey="Фабрика Б"
                    fill="#ff0000"
                    onClick={(data) => handleBarClick(data, "Фабрика Б")}
                  />
                </>
              ) : displayMode === "product1" ? (
                <>
                  <Bar
                    dataKey="Фабрика А (Product 1)"
                    fill="#8884d8"
                    onClick={(data) => handleBarClick(data, "Фабрика А")}
                  />
                  <Bar
                    dataKey="Фабрика Б (Product 1)"
                    fill="#ff7300"
                    onClick={(data) => handleBarClick(data, "Фабрика Б")}
                  />
                </>
              ) : (
                <>
                  <Bar
                    dataKey="Фабрика А (Product 2)"
                    fill="#82ca9d"
                    onClick={(data) => handleBarClick(data, "Фабрика А")}
                  />
                  <Bar
                    dataKey="Фабрика Б (Product 2)"
                    fill="#ffc658"
                    onClick={(data) => handleBarClick(data, "Фабрика Б")}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </Graph>
      </GraphContainer>
    </Container>
  );
};

export default MainPage;
