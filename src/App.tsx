
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Index from "@/pages/Index"
import Profile from "@/pages/Profile"
import Events from "@/pages/Events"
import FindVets from "@/pages/FindVets"
import PetEssentials from "@/pages/PetEssentials"
import CreateEvent from "@/pages/CreateEvent"
import VetDashboard from "@/pages/VetDashboard"
import VetOnboarding from "@/pages/VetOnboarding"
import Auth from "@/pages/Auth"
import NotFound from "@/pages/NotFound"
import { AuthProvider, useAuth } from "@/components/AuthProvider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <motion.div 
        className="w-12 h-12 border-4 border-petsu-yellow rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.img 
        src="/lovable-uploads/1a656558-105f-41b6-b91a-c324a03f1217.png"
        alt="Petsu"
        className="w-32 h-auto"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!session) {
    return <Navigate to="/auth" />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
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
      path="/find-vets"
      element={
        <ProtectedRoute>
          <FindVets />
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
    <Route
      path="/vet-onboarding"
      element={
        <ProtectedRoute>
          <VetOnboarding />
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
