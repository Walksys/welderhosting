import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, Server } from "lucide-react";

interface AuthProps {
  onAuthenticate: (user: { email: string; username: string; avatar?: string; discordId?: string }) => void;
}

const Auth = ({ onAuthenticate }: AuthProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await handleAuthSuccess(session.user);
      }
    };
    checkUser();
  }, []);

  const handleAuthSuccess = async (user: any) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      onAuthenticate({
        email: user.email || "",
        username: profile.username,
        avatar: profile.avatar,
        discordId: profile.discord_id,
      });
      navigate("/dashboard");
    }
  };

  const handleDiscordAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth`,
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
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-md glass-card glow-border-strong">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Server className="w-16 h-16 text-primary glow-text animate-pulse" />
          </div>
          <CardTitle className="text-4xl font-bold glow-text">Welder Hosting</CardTitle>
          <CardDescription className="text-lg">
            Connect with Discord to access your hosting dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleDiscordAuth}
            disabled={loading}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white transition-smooth h-14 text-lg glow-border hover:glow-border-strong"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Connecting to Discord...
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Login with Discord
              </>
            )}
          </Button>

          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border animate-fade-in">
            <p className="text-sm font-medium text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Authentication Required
            </p>
            <p className="text-xs text-center text-muted-foreground">
              You must log in with your <span className="font-semibold text-foreground">real Discord account</span> to earn and spend points.
              Simulated or fake logins will be rejected.
            </p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our Terms of Service
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
