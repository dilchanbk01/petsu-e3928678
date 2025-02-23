
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Index from "@/pages/Index"
import Profile from "@/pages/Profile"
import Events from "@/pages/Events"
import Event from "@/pages/Event"  // Add this import
import FindVets from "@/pages/FindVets"
import PetEssentials from "@/pages/PetEssentials"
import CreateEvent from "@/pages/CreateEvent"
import VetDashboard from "@/pages/VetDashboard"
import VetOnboarding from "@/pages/VetOnboarding"
import Auth from "@/pages/Auth"
import VetAuth from "@/pages/VetAuth"
import AdminAuth from "@/pages/AdminAuth"
import AdminDashboard from "@/pages/AdminDashboard"
import NotFound from "@/pages/NotFound"
import { AuthProvider, useAuth } from "@/components/AuthProvider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/auth" />;
  }

  return children;
};

const VetRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/vet-auth" />;
  }

  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/admin-auth" />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Index />} />
    <Route path="/find-vets" element={<FindVets />} />
    <Route path="/pet-essentials" element={<PetEssentials />} />
    <Route path="/events" element={<Events />} />
    <Route path="/events/:id" element={<Event />} />  {/* Add this route */}
    <Route path="/vet-onboarding" element={<VetOnboarding />} />
    
    {/* Auth routes */}
    <Route path="/auth" element={<Auth />} />
    <Route path="/vet-auth" element={<VetAuth />} />
    <Route path="/admin-auth" element={<AdminAuth />} />

    {/* Protected user routes */}
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/create-event"
      element={
        <ProtectedRoute>
          <CreateEvent />
        </ProtectedRoute>
      }
    />

    {/* Protected vet routes */}
    <Route
      path="/vet-dashboard"
      element={
        <VetRoute>
          <VetDashboard />
        </VetRoute>
      }
    />

    {/* Protected admin routes */}
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-center" expand={true} richColors />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
