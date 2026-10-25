import { isBug } from "@/bugs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useFavorites = () => {
  const { user } = useAuth();

  const { data: favorites = [], ...rest } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites" as any)
        .select("artist_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data as any[]).map((f: any) => f.artist_id as string);
    },
    enabled: !!user,
  });

  return { favoriteIds: new Set(favorites), ...rest };
};

export const useToggleFavorite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ artistId, isFavorite }: { artistId: string; isFavorite: boolean }) => {
      if (!user) throw new Error("Must be logged in");
      if (isFavorite) {
        // B13: with the bug, un-favoriting silently does nothing
        if (isBug("B13")) return;
        const { error } = await supabase
          .from("favorites" as any)
          .delete()
          .eq("user_id", user.id)
          .eq("artist_id", artistId);
        if (error) throw error;
      } else {
        // B14: with the bug, saving a SECOND favorite sends a wrong column name (first one works,
        // so B13 stays reachable); the error is swallowed (console only, no UI feedback)
        const existing = (queryClient.getQueryData(["favorites", user.id]) as string[] | undefined) ?? [];
        const b14Active = isBug("B14") && existing.length >= 1;
        const { error } = await supabase
          .from("favorites" as any)
          .insert((b14Active ? { user_id: user.id, artist: artistId } : { user_id: user.id, artist_id: artistId }) as any);
        if (error) {
          if (b14Active) {
            console.error(error);
            return;
          }
          throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useFavoriteArtists = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorite-artists", user?.id],
    queryFn: async () => {
      const { data: favs, error: favError } = await supabase
        .from("favorites" as any)
        .select("artist_id")
        .eq("user_id", user!.id);
      if (favError) throw favError;

      const ids = (favs as any[]).map((f: any) => f.artist_id);
      if (ids.length === 0) return [];

      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .in("id", ids);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
