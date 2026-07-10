import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthCard } from "@/pages/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes/paths";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signUpError } = await signUp(email, password, fullName);

    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    showToast({
      variant: "success",
      title: "Account created",
      description: "Check your inbox to confirm your email if confirmation is required, then log in.",
    });
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <AuthCard
      title="Create your account"
      description="Join Nirbhaya AI and start travelling the safer way."
      footer={
        <>
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:text-primary-500">
            Log in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Full name"
          placeholder="Jane Doe"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
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
          autoComplete="new-password"
          hint={!error ? "Use at least 8 characters." : undefined}
          error={error ?? undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
