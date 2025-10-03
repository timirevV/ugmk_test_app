import { useParams, useLocation } from "react-router-dom";
import { Pie, PieChart, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { monthNames } from "../../constants";
import { Container } from "./style";

const COLORS = ["#0088FE", "#FF8042"];

const DetailsPage = () => {
  const { factoryId, monthNumber } = useParams();
  const location = useLocation();

  const { product1Sum, product2Sum } = location.state || {};

  const factoryLabel =
    factoryId === "1" ? "А" : factoryId === "2" ? "Б" : factoryId;

  const monthLabel =
    monthNumber && !isNaN(Number(monthNumber))
      ? monthNames[Number(monthNumber) - 1]
      : monthNumber;

  const data = [
    { name: "Продукт 1", value: product1Sum || 0 },
    { name: "Продукт 2", value: product2Sum || 0 },
  ];

  return (
    <Container>
      <h2>
        Статистика по продукции фабрики {factoryLabel} за {monthLabel}
      </h2>

      <ResponsiveContainer width="50%" height="50%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius="70%"
            label={({ value }) => `${value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default DetailsPage;
