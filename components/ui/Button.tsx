import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

function cn(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Button behavior (global):
 * - Smooth hover/active transitions
 * - Subtle "shine" sweep on hover (premium, not glowy)
 * - Strong focus ring (accessibility)
 * - Respects prefers-reduced-motion
 */
const base =
  "relative inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold " +
  "select-none overflow-hidden " +
  "transition-[transform,box-shadow,background-color,border-color,opacity] duration-200 ease-out " +
  "active:scale-[0.98] " +
  "motion-reduce:transition-none motion-reduce:transform-none";

const shine =
  // subtle shine overlay (works on both buttons)
  "after:content-[''] after:absolute after:inset-y-[-40%] after:left-[-60%] after:w-[50%] after:rotate-12 " +
  "after:bg-white/20 after:blur-md after:opacity-0 " +
  "hover:after:opacity-100 hover:after:translate-x-[220%] " +
  "after:transition-[transform,opacity] after:duration-500 after:ease-out " +
  "motion-reduce:after:transition-none motion-reduce:hover:after:opacity-0";

export function PrimaryButton({ href, children, className, ...rest }: Props) {
  return (
    <Link
      href={href}
      {...rest}
      className={cn(
        base,
        "bg-vss-accent text-black",
        // premium depth + controlled glow
        "shadow-[0_10px_28px_rgba(255,140,0,0.12),0_18px_55px_rgba(0,0,0,0.45)]",
        // hover polish
        "hover:-translate-y-[2px] hover:opacity-95 hover:shadow-[0_14px_36px_rgba(255,140,0,0.14),0_22px_70px_rgba(0,0,0,0.55)]",
        // active press
        "active:translate-y-0 active:shadow-[0_8px_20px_rgba(255,140,0,0.10),0_14px_44px_rgba(0,0,0,0.45)]",
        // focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vss-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
        // subtle inner highlight
        "before:content-[''] before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100",
        "before:bg-gradient-to-b before:from-white/18 before:to-transparent",
        "before:transition-opacity before:duration-200",
        shine,
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

export function SecondaryButton({ href, children, className, ...rest }: Props) {
  return (
    <Link
      href={href}
      {...rest}
      className={cn(
        base,
        "bg-white/4 border border-white/10 text-vss-text",
        // base depth
        "shadow-[0_14px_45px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.04)]",
        // hover polish (slightly brighter, tighter border)
        "hover:-translate-y-[2px] hover:bg-white/7 hover:border-white/16 hover:shadow-[0_18px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]",
        // active press
        "active:translate-y-0 active:bg-white/6",
        // focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
        // subtle inner gradient on hover
        "before:content-[''] before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100",
        "before:bg-gradient-to-b before:from-white/10 before:to-transparent",
        "before:transition-opacity before:duration-200",
        shine,
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
