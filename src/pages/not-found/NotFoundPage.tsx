import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <ShieldAlert size={40} className="mb-4 text-neutral-600" />
      <h1 className="text-3xl font-semibold text-neutral-50">404</h1>
      <p className="mt-2 text-neutral-400">This route doesn&apos;t exist — even the safest ones don&apos;t.</p>
      <Link to={ROUTES.HOME} className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
