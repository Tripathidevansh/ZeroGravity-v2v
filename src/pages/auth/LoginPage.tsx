import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthCard } from "@/pages/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes/paths";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await signIn(email, password);

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError);
      return;
    }

    const redirectTo = (location.state as { from?: string } | null)?.from ?? ROUTES.DASHBOARD;
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to see your safest routes and recent activity."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.SIGNUP} className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </>
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
          required
        />
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ?? undefined}
          required
        />
        <div className="flex items-center justify-end">
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs font-medium text-primary-600 hover:text-primary-500">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}
