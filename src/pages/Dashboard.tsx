import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import ArtistDashboard from "@/components/dashboard/ArtistDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

const Dashboard = () => {
  const { user, artistId, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse text-muted-foreground font-serif text-lg">Loading…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return artistId ? <ArtistDashboard artistId={artistId} /> : <CustomerDashboard />;
};

export default Dashboard;
