export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/** Voci della barra di navigazione principale (ancore della homepage). */
export const mainNav: NavLink[] = [
  { label: "Mercati", href: "/#mercati" },
  { label: "Trading", href: "/#trading" },
  { label: "Analisi", href: "/#analisi" },
  { label: "Multichain", href: "/#multichain" },
  { label: "Come funziona", href: "/#come-funziona" },
];

export const authLinks = {
  login: { label: "Accedi", href: "/accedi" },
  register: { label: "Registrati", href: "/registrati" },
} as const;

/**
 * Pagine informative non ancora redatte.
 * Vengono generate come segnaposto (noindex) da app/[slug]/page.tsx,
 * così nessun link del footer porta a un 404.
 */
export const placeholderPages = {
  "chi-siamo": "Chi siamo",
  contatti: "Contatti",
  carriere: "Carriere",
  "centro-assistenza": "Centro assistenza",
  faq: "FAQ",
  "privacy-policy": "Privacy Policy",
  "cookie-policy": "Cookie Policy",
  "termini-e-condizioni": "Termini e condizioni",
  disclaimer: "Disclaimer",
} as const;

export type PlaceholderSlug = keyof typeof placeholderPages;

export function isPlaceholderSlug(slug: string): slug is PlaceholderSlug {
  return Object.hasOwn(placeholderPages, slug);
}

const page = (slug: PlaceholderSlug): NavLink => ({ label: placeholderPages[slug], href: `/${slug}` });

export const footerNav: NavGroup[] = [
  {
    title: "Piattaforma",
    links: [
      { label: "Mercati", href: "/#mercati" },
      { label: "Trading", href: "/#trading" },
      { label: "Analisi", href: "/#analisi" },
      { label: "Multichain", href: "/#multichain" },
    ],
  },
  { title: "Azienda", links: [page("chi-siamo"), page("contatti"), page("carriere")] },
  { title: "Supporto", links: [page("centro-assistenza"), page("faq"), page("contatti")] },
  {
    title: "Legale",
    links: [page("privacy-policy"), page("cookie-policy"), page("termini-e-condizioni"), page("disclaimer")],
  },
];
