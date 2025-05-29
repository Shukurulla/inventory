import { handleCheckAuth } from "@/lib/handleCheckAuth";

export const useAuth = () => {
  return handleCheckAuth();
};