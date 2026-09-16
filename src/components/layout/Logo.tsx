import Link from "next/link";
import { siteConfig } from "@/data/content";

/** Logo segnaposto: sostituire marchio e nome con quelli definitivi. */
export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="group inline-flex items-center gap-2.5" aria-label={`${siteConfig.name}, home`}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="0.5" y="0.5" width="27" height="27" rx="8" fill="#0d1512" stroke="#274036" />
        <path d="M8 18.5 12.5 13l3 3L20 9.5" fill="none" stroke="#67e3ae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="9.5" r="1.6" fill="#67e3ae" />
      </svg>
      <span className="font-wide text-[0.975rem] font-semibold tracking-tight text-paper">{siteConfig.name}</span>
    </Link>
  );
}
