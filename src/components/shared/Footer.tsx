import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import { Container } from "@/components/shared/Container";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Contact", href: "mailto:hello@safecircle.ai" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-neutral-50">
            <ShieldCheck className="text-primary-400" size={20} />
            {APP_NAME}
          </Link>
          <p className="mt-3 max-w-xs text-sm text-neutral-500">
            Community-driven safety navigation, built for prevention, not reaction.
          </p>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.heading}>
            <h4 className="text-sm font-semibold text-neutral-200">{group.heading}</h4>
            <ul className="mt-3 flex flex-col gap-2 list-none p-0 m-0 text-left">
              {group.links.map((link) => (
                <li key={link.label} className="p-0 m-0 text-left">
                  <a href={link.href} className="text-sm text-neutral-500 hover:text-neutral-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-[var(--color-border-subtle)] py-6 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
