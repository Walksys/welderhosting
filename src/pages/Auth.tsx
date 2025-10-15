import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDiscordAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${import.meta.env.VITE_REDIRECT_URL}/auth`,
          scopes: "identify email",
        },
      });

      if (error) {
        console.error("Discord OAuth error:", error);
        setError("Failed to connect to Discord. Please try again.");
        toast({
          title: "Authentication Error",
          description: "Please log in with your real Discord account.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Discord auth error:", err);
      setError("Authentication failed. Please ensure you're using a real Discord account.");
      toast({
        title: "Error",
        description: err.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-4">Login with Discord</h1>
      <Button
        onClick={handleDiscordAuth}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        {loading ? "Connecting..." : "Login with Discord"}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
