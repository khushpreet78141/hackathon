import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./components/pages/LandingPage";
import DashboardPage from "./components/pages/DashboardPage";
import ContactPage from "./components/pages/ContactPage";
<<<<<<< HEAD
import AboutPage from "./components/pages/AboutPage";
=======
import Login from "./components/Login";
import Register from "./components/Register";

>>>>>>> ccc8a2cd6c623b116cace9916a0c7aea335f00cb
export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
<<<<<<< HEAD
         <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
=======
>>>>>>> ccc8a2cd6c623b116cace9916a0c7aea335f00cb

      </Routes>

    </BrowserRouter>
  );
}