import { Link, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { AuthCard } from "@/pages/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";

export default function SignupPage() {
  const navigate = useNavigate();

  // Phase 2: no real auth yet — this simulates a successful signup so the
  // demo flow is clickable end-to-end. Real Supabase auth lands in Phase 3.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <AuthCard
      title="Create your account"
      description="Join SafeCircle AI and start travelling the safer way."
      footer={
        <>
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="font-medium text-primary-400 hover:text-primary-300">
            Log in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input label="Full name" placeholder="Jane Doe" autoComplete="name" required />
        <Input type="email" label="Email" placeholder="you@example.com" autoComplete="email" required />
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          hint="Use at least 8 characters."
          minLength={8}
          required
        />
        <Button type="submit" className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
