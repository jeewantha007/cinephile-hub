import { useState } from "react";
import { MessageSquare, Star, ChevronDown, ChevronUp, ExternalLink, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Review } from "@/lib/tmdb";

interface ReviewSectionProps {
  reviews: Review[];
}

const getRatingColor = (rating: number) => {
  if (rating >= 8) return "from-green-500/20 to-green-500/5 text-green-400 border-green-500/30";
  if (rating >= 6) return "from-yellow-500/20 to-yellow-500/5 text-yellow-400 border-yellow-500/30";
  return "from-red-500/20 to-red-500/5 text-red-400 border-red-500/30";
};

const getRatingBg = (rating: number) => {
  if (rating >= 8) return "bg-green-500/15 text-green-400";
  if (rating >= 6) return "bg-yellow-500/15 text-yellow-400";
  return "bg-red-500/15 text-red-400";
};

const StarRating = ({ rating }: { rating: number }) => {
  const stars = Math.round(rating / 2);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="text-xs font-bold text-foreground ml-1">{rating}/10</span>
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.content.length > 300;
  const displayContent = expanded ? review.content : review.content.slice(0, 300);
  const rating = review.author_details.rating;
  const avatarUrl = review.author_details.avatar_path
    ? review.author_details.avatar_path.startsWith("/http")
      ? review.author_details.avatar_path.slice(1)
      : `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
    : null;

  return (
    <div className="group relative bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden ring-1 ring-border/20 hover:ring-border/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      {/* Accent top border based on rating */}
      {rating && (
        <div
          className={`h-0.5 w-full bg-gradient-to-r ${getRatingColor(rating)}`}
        />
      )}

      <div className="p-5 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={review.author}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-border/30"
                loading="lazy"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <span className="text-base font-bold text-primary">
                  {review.author.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Author info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-foreground truncate">
                {review.author}
              </p>
              {review.author_details.username && review.author_details.username !== review.author && (
                <span className="text-xs text-muted-foreground">@{review.author_details.username}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(review.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Rating badge */}
          {rating && (
            <div className={`shrink-0 px-3 py-1.5 rounded-xl ${getRatingBg(rating)} flex items-center gap-1.5`}>
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-sm font-bold">{rating}</span>
            </div>
          )}
        </div>

        {/* Star visualization */}
        {rating && (
          <div className="pl-14">
            <StarRating rating={rating} />
          </div>
        )}

        {/* Content */}
        <div className="relative">
          <Quote className="absolute -top-1 -left-1 h-6 w-6 text-primary/10" />
          <p className="text-sm text-muted-foreground leading-relaxed pl-6">
            {displayContent}
            {isLong && !expanded && "…"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {isLong && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-muted-foreground hover:text-foreground gap-1 h-8 px-2"
              >
                {expanded ? (
                  <>Show less <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>Read more <ChevronDown className="h-3 w-3" /></>
                )}
              </Button>
            )}
          </div>
          <a
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors"
          >
            Full review <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

const ReviewSection = ({ reviews }: ReviewSectionProps) => {
  if (!reviews || reviews.length === 0) return null;

  const avgRating =
    reviews.filter((r) => r.author_details.rating).length > 0
      ? reviews
          .filter((r) => r.author_details.rating)
          .reduce((sum, r) => sum + (r.author_details.rating || 0), 0) /
        reviews.filter((r) => r.author_details.rating).length
      : null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" /> Reviews
          <span className="text-sm font-normal text-muted-foreground ml-1">
            ({reviews.length})
          </span>
        </h2>
        {avgRating && (
          <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 ring-1 ring-border/30">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-foreground">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">avg rating</span>
          </div>
        )}
      </div>

      <div className="grid gap-4 max-w-3xl">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
