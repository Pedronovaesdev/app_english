import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ActivePracticePage } from "./pages/ActivePracticePage";
import { ArticlesPage } from "./pages/ArticlesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { SaturdayPage } from "./pages/SaturdayPage";
import { ShadowingPage } from "./pages/ShadowingPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="cards" element={<FlashcardsPage />} />
        <Route path="saturday" element={<SaturdayPage />} />
        <Route path="shadowing" element={<ShadowingPage />} />
        <Route path="practice" element={<ActivePracticePage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
