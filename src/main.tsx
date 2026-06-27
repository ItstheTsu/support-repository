import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { IncidentProvider } from "./contexts/IncidentContext";
import { SearchProvider } from "./contexts/SearchContext";
import { ModalProvider } from "./contexts/ModalContext";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

import CreateIncidentModal from "./components/modals/CreateIncidentModal";
import EditIncidentModal from "./components/modals/EditIncidentModal";
import IncidentPreviewModal from "./components/modals/IncidentPreviewModal";
import SearchTagsModal from "./components/modals/SearchTagsModal";
import ConfirmDeleteModal from "./components/modals/ConfirmDeleteModal";

import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Incident from "./pages/Incident";
import CreateIncident from "./pages/CreateIncident";
import Ranking from "./pages/Ranking";
import TagsPage from "./pages/TagsPage";
import UsersPage from "./pages/UsersPage";
import NotFound from "./pages/NotFound";
import Loading from "./components/Loading";

function MasterOnly({ children }: { children: React.ReactNode }) {
  const { isMaster, loading } = useAuth();
  if (loading) return null;
  return isMaster ? <>{children}</> : <Navigate to="/" replace />;
}

function AppShell() {
  const { user, loading } = useAuth();

  if (loading) return <Loading fullScreen label="Carregando..." />;
  if (!user) return <LoginPage />;

  return (
    <IncidentProvider>
      <SearchProvider>
        <ModalProvider>
          <div className="flex min-h-screen flex-col bg-[#0B0F14] text-[#E6EDF3]">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/incident/:id" element={<Incident />} />
                  <Route
                    path="/create"
                    element={<MasterOnly><CreateIncident /></MasterOnly>}
                  />
                  <Route path="/ranking" element={<Ranking />} />
                  <Route
                    path="/tags"
                    element={<MasterOnly><TagsPage /></MasterOnly>}
                  />
                  <Route
                    path="/users"
                    element={<MasterOnly><UsersPage /></MasterOnly>}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Footer />

            <CreateIncidentModal />
            <EditIncidentModal />
            <IncidentPreviewModal />
            <SearchTagsModal />
            <ConfirmDeleteModal />
          </div>
        </ModalProvider>
      </SearchProvider>
    </IncidentProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);