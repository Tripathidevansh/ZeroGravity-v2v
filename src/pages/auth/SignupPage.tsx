import { Link } from "react-router-dom";
import { AuthCard } from "@/pages/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";

export default function SignupPage() {
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
      <form className="flex flex-col gap-4">
        <Input label="Full name" placeholder="Jane Doe" autoComplete="name" />
        <Input type="email" label="Email" placeholder="you@example.com" autoComplete="email" />
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          hint="Use at least 8 characters."
        />
        <Button type="submit" className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
