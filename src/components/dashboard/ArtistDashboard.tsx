import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Clock, User, Calendar, Star } from "lucide-react";

const ArtistDashboard = ({ artistId }: { artistId: string }) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: artist } = useQuery({
    queryKey: ["artist-dashboard", artistId],
    queryFn: async () => {
      const { data, error } = await supabase.from("artists").select("*").eq("id", artistId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["artist-bookings", artistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("artist_id", artistId)
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artist-bookings"] });
      toast({ title: "Booking updated" });
    },
  });

  const toggleAvailability = useMutation({
    mutationFn: async (available: boolean) => {
      const { error } = await supabase.from("artists").update({ is_available_today: available }).eq("id", artistId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artist-dashboard"] });
      toast({ title: "Availability updated" });
    },
  });

  // Profile edit state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editAvailable, setEditAvailable] = useState(false);
  const [editWhatsappKey, setEditWhatsappKey] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (artist && !initialized) {
    setEditName(artist.name || "");
    setEditBio(artist.bio || "");
    setEditPhone(artist.phone || "");
    setEditPrice(String(artist.price_from || 0));
    setEditAvailable(artist.is_available_today || false);
    setEditWhatsappKey((artist as any).whatsapp_api_key || "");
    setInitialized(true);
  }

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("artists")
        .update({
          name: editName,
          bio: editBio,
          phone: editPhone,
          price_from: parseInt(editPrice) || 0,
          is_available_today: editAvailable,
          whatsapp_api_key: editWhatsappKey || null,
        } as any)
        .eq("id", artistId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artist-dashboard"] });
      toast({ title: "Profile updated successfully" });
    },
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-16 lg:px-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            Artist Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {artist?.name || "Artist"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {artist?.is_available_today && (
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            )}
            <span className="text-sm text-muted-foreground">Available Today</span>
            <Switch
              checked={artist?.is_available_today ?? false}
              onCheckedChange={(checked) => toggleAvailability.mutate(checked)}
              disabled={toggleAvailability.isPending}
            />
          </div>
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </div>
      </div>

      {/* Featured Banner */}
      {artist && !(artist as any).is_featured && (
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Get Featured on Naqsh</p>
                <p className="text-sm text-muted-foreground">Appear at the top of search results and homepage for 50 AED/week</p>
              </div>
            </div>
            <Button
              onClick={async () => {
                const { data, error } = await supabase.functions.invoke("create-artist-payment", {
                  body: { payment_type: "featured", artist_id: artistId },
                });
                if (data?.url) window.open(data.url, "_blank");
                if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
              }}
            >
              Get Featured — 50 AED
            </Button>
          </CardContent>
        </Card>
      )}
      {artist && (artist as any).is_featured && (
        <Card className="mb-8 border-primary/30">
          <CardContent className="flex items-center gap-3 p-4">
            <Star className="h-5 w-5 text-primary fill-primary" />
            <div>
              <p className="font-medium text-primary">You're Featured!</p>
              <p className="text-sm text-muted-foreground">
                Featured until {new Date((artist as any).featured_until).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-semibold text-foreground">{pendingBookings.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Check className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-semibold text-foreground">{confirmedBookings.length}</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-semibold text-foreground">{bookings.length}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingBookings.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No pending bookings</p>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map(b => (
                <Card key={b.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-foreground">{b.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {b.package && <Badge variant="secondary" className="mr-2">{b.package}</Badge>}
                        {b.occasion || "No occasion specified"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateBookingStatus.mutate({ id: b.id, status: "confirmed" })}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateBookingStatus.mutate({ id: b.id, status: "cancelled" })}>
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed">
          {confirmedBookings.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No confirmed bookings</p>
          ) : (
            <div className="space-y-3">
              {confirmedBookings.map(b => (
                <Card key={b.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-foreground">{b.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {b.package && <Badge variant="secondary" className="mr-2">{b.package}</Badge>}
                        {b.occasion || "No occasion specified"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateBookingStatus.mutate({ id: b.id, status: "completed" })}>
                        <Check size={14} className="mr-1" /> Mark Complete
                      </Button>
                      <Badge className="bg-primary/10 text-primary border-primary/20">Confirmed</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif font-light">Edit Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={e => { e.preventDefault(); updateProfile.mutate(); }} className="space-y-4 max-w-lg">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px]"
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Starting Price (AED)</Label>
                  <Input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={editAvailable}
                    onChange={e => setEditAvailable(e.target.checked)}
                    className="rounded border-input"
                  />
                  <Label htmlFor="available">Available today</Label>
                </div>
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label>WhatsApp Notification Key (CallMeBot)</Label>
                  <Input
                    value={editWhatsappKey}
                    onChange={e => setEditWhatsappKey(e.target.value)}
                    placeholder="Your CallMeBot API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    To get your key: save CallMeBot (+34 644 44 65 57) on WhatsApp, send "I allow callmebot to send me messages", and use the API key they reply with.
                  </p>
                </div>
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving…" : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistDashboard;
