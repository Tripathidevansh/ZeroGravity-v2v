import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthCard } from "@/pages/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes/paths";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: resetError } = await resetPassword(email);

    setIsSubmitting(false);

    if (resetError) {
      setError(resetError);
      return;
    }

    showToast({
      variant: "success",
      title: "Reset link sent",
      description: "Check your inbox for a link to reset your password.",
    });
    navigate(ROUTES.LOGIN);
  };

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we'll send you a link to reset your password."
      footer={
        <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:text-primary-500">
          Back to log in
        </Link>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error ?? undefined}
          required
        />
        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
