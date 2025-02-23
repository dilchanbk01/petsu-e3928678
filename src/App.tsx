
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Index from "@/pages/Index"
import Profile from "@/pages/Profile"
import Events from "@/pages/Events"
import EventDetail from "@/pages/EventDetail"
import FindVets from "@/pages/FindVets"
import PetEssentials from "@/pages/PetEssentials"
import CreateEvent from "@/pages/CreateEvent"
import VetDashboard from "@/pages/VetDashboard"
import VetOnboarding from "@/pages/VetOnboarding"
import AdminDashboard from "@/pages/AdminDashboard"
import NotFound from "@/pages/NotFound"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* All routes accessible without auth */}
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/find-vets" element={<FindVets />} />
          <Route path="/pet-essentials" element={<PetEssentials />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/vet-onboarding" element={<VetOnboarding />} />
          <Route path="/vet-dashboard" element={<VetDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" expand={true} richColors />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
