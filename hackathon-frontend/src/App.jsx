import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./components/pages/LandingPage";
import DashboardPage from "./components/pages/DashboardPage";

export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Overview Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
         <Route path="/contact" element={<ContactPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />

      </Routes>

    </BrowserRouter>
  );
}