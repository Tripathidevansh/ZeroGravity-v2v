import { Link, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { AuthCard } from "@/pages/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { ROUTES } from "@/routes/paths";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Phase 2: no real auth/email yet — this simulates the reset flow so the
  // demo is clickable end-to-end. Real email delivery lands in Phase 3.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast({
      variant: "success",
      title: "Reset link sent",
      description: "Check your inbox for a link to reset your password. (Simulated — no email sent.)",
    });
    navigate(ROUTES.LOGIN);
  };

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we'll send you a link to reset your password."
      footer={
        <Link to={ROUTES.LOGIN} className="font-medium text-primary-400 hover:text-primary-300">
          Back to log in
        </Link>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input type="email" label="Email" placeholder="you@example.com" autoComplete="email" required />
        <Button type="submit" className="mt-2 w-full">
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
