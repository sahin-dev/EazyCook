import { CookingPot } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Hearthly home">
      <span className="logo-mark"><CookingPot size={20} strokeWidth={2.4} /></span>
      <span>hearthly</span>
    </Link>
  );
}
