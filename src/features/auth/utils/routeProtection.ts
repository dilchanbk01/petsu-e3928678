
import { Session } from "@supabase/supabase-js";
import { UserType } from "../types/auth";
import { toast } from "sonner";

export const handleAuthRedirection = (
  loading: boolean,
  session: Session | null,
  userType: UserType,
  currentPath: string,
  navigate: (path: string) => void
) => {
  if (loading) return;

  const publicRoutes = ['/', '/auth', '/vet-auth', '/admin-auth', '/vet-onboarding'];

  // Allow access to public routes
  if (publicRoutes.includes(currentPath)) return;

  // Redirect to appropriate auth page if not authenticated
  if (!session) {
    if (currentPath.startsWith('/admin')) {
      navigate('/admin-auth');
    } else if (currentPath.startsWith('/vet')) {
      navigate('/vet-auth');
    } else {
      navigate('/auth');
    }
    return;
  }

  // Role-based access control
  if (currentPath.startsWith('/admin') && userType !== 'admin') {
    navigate('/');
    toast.error('Access denied: Admin privileges required');
  } else if (currentPath.startsWith('/vet-dashboard') && userType !== 'vet') {
    navigate('/');
    toast.error('Access denied: Veterinarian privileges required');
  }
};
