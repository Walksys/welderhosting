import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Server } from "lucide-react";

interface AuthProps {
  onAuthenticate: (user: { email: string; username: string; avatar?: string; discordId?: string }) => void;
}

const Auth = ({ onAuthenticate }: AuthProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleDiscordAuth = () => {
    // TODO: Replace with your actual Discord OAuth2 endpoint
    // This should redirect to: /auth/discord
    // Backend should handle OAuth flow and redirect back with user data
    toast.info("Discord authentication will be available after backend integration");
    
    // Placeholder: Simulate Discord login for demo
    setTimeout(() => {
      const mockDiscordUser = {
        email: "user@discord.com",
        username: "DiscordUser#1234",
        avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
        discordId: "123456789"
      };
      onAuthenticate(mockDiscordUser);
      toast.success("Signed in with Discord!");
      navigate("/dashboard");
    }, 1000);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && !username) {
      toast.error("Please enter a username");
      return;
    }

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // TODO: Replace with your actual API endpoint
    // POST to: /api/auth/signup or /api/auth/login
    // Expected response: { user: { email, username } }
    
    // Placeholder: Simulate email auth
    const user = {
      email,
      username: username || email.split("@")[0],
    };
    
    onAuthenticate(user);
    toast.success(isSignUp ? "Account created successfully!" : "Signed in successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-md glass-card glow-border transition-smooth">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Server className="w-16 h-16 text-primary glow-text" />
          </div>
          <CardTitle className="text-3xl font-bold glow-text">Welcome to Welder</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your hosting dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Discord OAuth Button */}
          <Button
            onClick={handleDiscordAuth}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white transition-smooth hover:glow-border-strong"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Sign in with Discord
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Email/Password Auth */}
          <Tabs defaultValue="signin" className="w-full" onValueChange={(v) => setIsSignUp(v === "signup")}>
            <TabsList className="grid w-full grid-cols-2 glass-card">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-card transition-smooth focus:glow-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-card transition-smooth focus:glow-border"
                  />
                </div>
                <Button type="submit" className="w-full transition-smooth hover:glow-border-strong">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="glass-card transition-smooth focus:glow-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-card transition-smooth focus:glow-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-card transition-smooth focus:glow-border"
                  />
                </div>
                <Button type="submit" className="w-full transition-smooth hover:glow-border-strong">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-muted-foreground">
            Note: Discord login is required to create or redeem servers
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
