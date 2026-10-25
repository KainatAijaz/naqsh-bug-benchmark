import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Star, Heart, MapPin } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";
import { useFavoriteArtists, useToggleFavorite } from "@/hooks/useFavorites";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

const CustomerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);
  const { data: savedArtists = [] } = useFavoriteArtists();
  const toggleFavorite = useToggleFavorite();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["customer-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, artists(id, name, specialty, profile_image_url)")
        .eq("customer_id", user!.id)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch reviews by this user to know which bookings already have reviews
  const { data: userReviews = [] } = useQuery({
    queryKey: ["user-reviews", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("booking_id")
        .eq("customer_name", profile?.display_name || "");
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!profile,
  });

  const reviewedBookingIds = new Set(userReviews.map((r: any) => r.booking_id));

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-16 lg:px-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">My Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome, {profile?.display_name || user?.email}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/artists">
            <Button>Book an Artist</Button>
          </Link>
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-center py-12">Loading bookings…</p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
          <Link to="/artists">
            <Button>Browse Artists</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b: any) => (
            <div key={b.id}>
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    {b.artists?.profile_image_url && (
                      <img
                        src={b.artists.profile_image_url}
                        alt={b.artists.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{b.artists?.name || "Artist"}</p>
                      <p className="text-sm text-muted-foreground">
                        {b.date} • {b.package || b.artists?.specialty}
                      </p>
                      {b.occasion && (
                        <p className="text-xs text-muted-foreground">{b.occasion}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {b.status === "completed" && !reviewedBookingIds.has(b.id) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/5"
                        onClick={() => setReviewingBookingId(b.id)}
                      >
                        <Star size={14} className="mr-1" /> Leave Review
                      </Button>
                    )}
                    {b.status === "completed" && reviewedBookingIds.has(b.id) && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star size={12} className="fill-primary text-primary" /> Reviewed
                      </span>
                    )}
                    <Badge className={statusColors[b.status] || ""}>{b.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              {reviewingBookingId === b.id && b.artists && (
                <div className="mt-2 mb-4">
                  <ReviewForm
                    bookingId={b.id}
                    artistId={b.artists.id}
                    artistName={b.artists.name}
                    onClose={() => setReviewingBookingId(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Saved Artists Section */}
      {savedArtists.length > 0 && (
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-light text-foreground mb-6 flex items-center gap-2">
            <Heart size={20} className="text-primary" /> My Saved Artists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedArtists.map((a: any) => (
              <Card key={a.id} className="overflow-hidden group">
                <Link to={`/artist/${a.id}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img src={a.profile_image_url || "/placeholder.svg"} alt={a.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite.mutate({ artistId: a.id, isFavorite: true });
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
                    >
                      <Heart size={14} className="fill-primary text-primary" />
                    </button>
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link to={`/artist/${a.id}`}>
                    <p className="font-serif text-lg font-light text-foreground hover:text-primary transition-colors">{a.name}</p>
                  </Link>
                  <p className="text-xs text-primary tracking-widest uppercase">{a.specialty}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin size={12} /> {a.city}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-primary text-primary" />
                      <span className="text-sm text-foreground">{a.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
