import "server-only";
import { mockReviews, type Review } from "@/data/reviews.mock";
import { clampNumber, sanitizeText } from "@/lib/sanitize";

export interface ReviewsResult {
  reviews: Review[];
  isDemo: boolean;
}

/** Normalizza qualsiasi fonte (mock, Google Places, CMS) nel tipo Review. */
function normalize(r: Review): Review {
  return {
    ...r,
    author: sanitizeText(r.author, 80),
    text: sanitizeText(r.text, 600),
    rating: Math.round(clampNumber(r.rating, 1, 5, 5)),
  };
}

/**
 * Punto d'integrazione per recensioni verificate.
 * TODO: con REVIEWS_PROVIDER=google, recuperare le recensioni lato server
 * (Google Places API) rispettandone i termini di visualizzazione e attribuzione.
 */
export async function getReviews(): Promise<ReviewsResult> {
  return { reviews: mockReviews.map(normalize), isDemo: true };
}
