
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Index from "@/pages/Index"
import Profile from "@/pages/Profile"
import Events from "@/pages/Events"
import FindVets from "@/pages/FindVets"
import PetEssentials from "@/pages/PetEssentials"
import CreateEvent from "@/pages/CreateEvent"
import VetDashboard from "@/pages/VetDashboard"
import VetOnboarding from "@/pages/VetOnboarding"
import Auth from "@/pages/Auth"
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
    <Route path="/auth" element={<Auth />} />
    <Route path="/admin-auth" element={<AdminAuth />} />
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />
    {/* Public routes that don't require authentication */}
    <Route path="/" element={<Index />} />
    <Route path="/find-vets" element={<FindVets />} />
    <Route path="/vet-onboarding" element={<VetOnboarding />} />
    
    {/* Protected routes that require authentication */}
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/events"
      element={
        <ProtectedRoute>
          <Events />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pet-essentials"
      element={
        <ProtectedRoute>
          <PetEssentials />
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
    <Route
      path="/vet-dashboard"
      element={
        <ProtectedRoute>
          <VetDashboard />
        </ProtectedRoute>
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
