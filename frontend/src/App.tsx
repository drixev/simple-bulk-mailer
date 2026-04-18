import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BulkPage from "./pages/BulkPage";
import ComposePage from "./pages/ComposePage";
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/layout/Layout";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/compose" replace />}/>
          <Route path='/compose' element={<ComposePage/>}/>
          <Route path='/bulk' element={<BulkPage/>}/>
          <Route path='/settings' element={<SettingsPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
