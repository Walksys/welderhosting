import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BuyServer from "./pages/BuyServer";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{
    email: string;
    username: string;
    avatar?: string;
    discordId?: string;
  } | null>(null);
  const [userPoints, setUserPoints] = useState(0);

  const handleAuthenticate = async (userData: {
    email: string;
    username: string;
    avatar?: string;
    discordId?: string;
  }) => {
    setUser(userData);
    await loadUserPoints();
  };

  const handleLogout = () => {
    setUser(null);
  };

  const loadUserPoints = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", authUser.id)
        .single();

      if (profile) {
        setUserPoints(profile.points);
      }
    } catch (error) {
      console.error("Error loading points:", error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation isAuthenticated={!!user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/auth"
              element={
                user ? <Navigate to="/dashboard" /> : <Auth onAuthenticate={handleAuthenticate} />
              }
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />}
            />
            <Route
              path="/buy-server"
              element={
                user ? (
                  <BuyServer userPoints={userPoints} onPurchaseComplete={loadUserPoints} />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
