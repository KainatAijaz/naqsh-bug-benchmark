import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Artist = Tables<"artists">;

export const useArtists = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return data as Artist[];
    },
  });
};

export const useFeaturedArtists = () => {
  return useQuery({
    queryKey: ["featured-artists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("is_verified", true)
        .order("rating", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data as Artist[];
    },
  });
};

export const useArtist = (id: string) => {
  return useQuery({
    queryKey: ["artist", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Artist;
    },
    enabled: !!id,
  });
};

export const useArtistReviews = (artistId: string) => {
  return useQuery({
    queryKey: ["reviews", artistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("artist_id", artistId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!artistId,
  });
};

export const useArtistPortfolio = (artistId: string) => {
  return useQuery({
    queryKey: ["portfolio", artistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_images")
        .select("*")
        .eq("artist_id", artistId);
      if (error) throw error;
      return data;
    },
    enabled: !!artistId,
  });
};
