import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Login from "./Pages/Login";
import AdminUsers from "./Pages/AdminUsers";
import Dashboard from "./Pages/Dashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminFixed from "./Pages/AdminFixed";
import ProtectedRoutes from "./Routes/ProtectedRoutes";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/fixedData" element={<AdminFixed />} />
          <Route path="/admin" element={<AdminUsers />} />
          <Route path="/adminProd" element={<AdminProducts />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
