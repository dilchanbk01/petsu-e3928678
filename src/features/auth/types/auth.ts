
import { Session } from "@supabase/supabase-js";

export type UserType = 'user' | 'vet' | 'admin' | null;

export interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userType: UserType;
  refreshSession: () => Promise<void>;
}
