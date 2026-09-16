import { StarIcon } from "@/components/icons/Icon";

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-mint" role="img" aria-label={`Valutazione ${rating} su 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}
