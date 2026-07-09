import { Link } from "react-router-dom";
import { AuthCard } from "@/pages/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";

export default function ForgotPasswordPage() {
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
      <form className="flex flex-col gap-4">
        <Input type="email" label="Email" placeholder="you@example.com" autoComplete="email" />
        <Button type="submit" className="mt-2 w-full">
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
