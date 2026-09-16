import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/components/pages/PlaceholderPage";
import { isPlaceholderSlug, placeholderPages } from "@/data/navigation";

// Solo gli slug configurati: qualsiasi altro percorso restituisce 404
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(placeholderPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isPlaceholderSlug(slug)) return {};
  return { title: placeholderPages[slug], robots: { index: false } };
}

export default async function InfoPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  if (!isPlaceholderSlug(slug)) notFound();

  return (
    <PlaceholderPage title={placeholderPages[slug]}>
      <p>Il contenuto di questa pagina è in fase di redazione.</p>
      <p>Sarà pubblicato dopo la revisione legale e societaria.</p>
    </PlaceholderPage>
  );
}
