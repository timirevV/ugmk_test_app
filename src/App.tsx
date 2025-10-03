import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import DetailsPage from "./pages/DetailsPage";

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/details/:factoryId/:monthNumber" element={<DetailsPage />} />
      </Routes>
  );
};

export default App;
