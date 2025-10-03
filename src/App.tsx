import { Route, Routes } from "react-router";
import MainPage from "./pages/MainPage";
import ProductsPage from "./pages/ProductsPage";

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
  );
};

export default App;
