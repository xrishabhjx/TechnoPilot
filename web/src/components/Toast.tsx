import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="tc-toast">
      <CheckCircle2 size={13} /> {message}
    </div>
  );
}
