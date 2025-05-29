import { createContext } from "react";

export interface AuthContextType {
  isAuth: boolean;
  accessToken: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
