import { Link, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { AuthCard } from "@/pages/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";

export default function LoginPage() {
  const navigate = useNavigate();

  // Phase 2: no real auth yet — this simulates a successful login so the
  // demo flow is clickable end-to-end. Real Supabase auth lands in Phase 3.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to see your safest routes and recent activity."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.SIGNUP} className="font-medium text-primary-400 hover:text-primary-300">
            Sign up
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input type="email" label="Email" placeholder="you@example.com" autoComplete="email" required />
        <Input type="password" label="Password" placeholder="••••••••" autoComplete="current-password" required />
        <div className="flex items-center justify-end">
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs font-medium text-primary-400 hover:text-primary-300">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="mt-2 w-full">
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}
