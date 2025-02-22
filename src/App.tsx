
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import AuthProvider from "./components/AuthProvider";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import FindVets from "./pages/FindVets";
import VetOnboarding from "./pages/VetOnboarding";
import PetEssentials from "./pages/PetEssentials";
import VetDashboard from "./pages/VetDashboard";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/find-vets" element={<FindVets />} />
          <Route path="/vet-onboarding" element={<VetOnboarding />} />
          <Route path="/pet-essentials" element={<PetEssentials />} />
          <Route path="/vet-dashboard" element={<VetDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" />
      </AuthProvider>
    </Router>
  );
}

export default App;
