import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ErrorResponse {
  data: Record<string, string | string[]>;
  status?: number;
}

export function errorValidatingWithToast(err: unknown) {
  const error = err as ErrorResponse;

  if (error?.data) {
    const { data } = error;

    if (typeof data.detail === 'string') {
      toast.error(data.detail);
      return;
    }

    if (typeof data === 'object') {
      Object.values(data).forEach((messages) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg: string) => toast.error(msg));
        }
      });
      return;
    }
  }

  // 3. Fallback xabar
  toast.error("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
}
