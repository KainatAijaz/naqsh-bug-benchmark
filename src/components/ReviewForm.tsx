import { isBug } from "@/bugs";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  bookingId: string;
  artistId: string;
  artistName: string;
  onClose: () => void;
}

const ReviewForm = ({ bookingId, artistId, artistName, onClose }: ReviewFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = useMutation({
    mutationFn: async () => {
      if (rating === 0) throw new Error("Please select a rating");
      const { error } = await supabase.from("reviews").insert({
        artist_id: artistId,
        booking_id: bookingId,
        rating,
        comment: comment.trim() || null,
        customer_name: profile?.display_name || "Anonymous",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      // B11: with the bug the "already reviewed" list is not refreshed, so the Review button stays and duplicates are possible
      if (!isBug("B11")) queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["artist"] });
      toast({ title: "Review submitted!", description: "Thank you for your feedback." });
      onClose();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-xl font-light">
          Review your session with <span className="text-primary">{artistName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">How was your experience?</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={`transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-primary text-primary"
                      : "text-border"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <textarea
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
            placeholder="Share your experience (optional)…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => submitReview.mutate()}
            disabled={rating === 0 || submitReview.isPending}
          >
            {submitReview.isPending ? "Submitting…" : "Submit Review"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
