import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Copy, ExternalLink, User, Coins, MessageCircle } from "lucide-react";

interface DashboardProps {
  user: {
    email: string;
    username: string;
    avatar?: string;
    discordId?: string;
  };
}

const Dashboard = ({ user }: DashboardProps) => {
  const [points] = useState(250);
  const maxPoints = 1000;
  const [dashboardAccount, setDashboardAccount] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const generateDashboardAccount = async () => {
    // TODO: Replace with your actual API endpoint
    // POST to: /api/generate-account
    // Expected response: { email: string, password: string, consoleUrl: string }
    
    toast.info("Generating dashboard account...");
    
    // Placeholder: Simulate account generation
    setTimeout(() => {
      const generatedEmail = user.discordId 
        ? `discord+${user.discordId}@welder.host`
        : `${user.email.split('@')[0]}@panel.welder.host`;
      
      const generatedPassword = Math.random().toString(36).slice(-12);
      
      setDashboardAccount({
        email: generatedEmail,
        password: generatedPassword,
      });
      
      toast.success("Dashboard account generated!");
    }, 1500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const pointsPercentage = (points / maxPoints) * 100;

  return (
    <div className="min-h-screen p-4 pt-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 glow-text">Dashboard</h1>
          <p className="text-muted-foreground">Manage your hosting services</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Profile Card */}
          <Card className="glass-card glow-border transition-smooth hover:glow-border-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="w-20 h-20 rounded-full border-2 border-primary glow-border mx-auto"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto border-2 border-primary">
                  <User className="w-10 h-10 text-primary" />
                </div>
              )}
              <div className="text-center">
                <p className="font-semibold text-lg">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.discordId && (
                  <p className="text-xs text-primary mt-1">✓ Discord Connected</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Points Card */}
          <Card className="glass-card glow-border transition-smooth hover:glow-border-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                Points
              </CardTitle>
              <CardDescription>Your current balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold glow-text">{points}</p>
                <p className="text-sm text-muted-foreground">of {maxPoints} points</p>
              </div>
              <Progress value={pointsPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                Earn points by completing tasks and inviting friends
              </p>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="glass-card glow-border transition-smooth hover:glow-border-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Support
              </CardTitle>
              <CardDescription>Need help?</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] transition-smooth"
                onClick={() => window.open("https://discord.gg/your-invite", "_blank")}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Discord Server
              </Button>
            </CardContent>
          </Card>

          {/* Dashboard Account Generation Card */}
          <Card className="glass-card glow-border transition-smooth hover:glow-border-strong md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Server Dashboard Access</CardTitle>
              <CardDescription>
                Generate credentials to access your server management panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!dashboardAccount ? (
                <Button
                  onClick={generateDashboardAccount}
                  size="lg"
                  className="w-full transition-smooth hover:glow-border-strong"
                >
                  Generate Dashboard Account
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={dashboardAccount.email}
                          readOnly
                          className="flex-1 bg-secondary px-4 py-2 rounded-md text-sm"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyToClipboard(dashboardAccount.email, "Email")}
                          className="transition-smooth hover:glow-border"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={dashboardAccount.password}
                          readOnly
                          className="flex-1 bg-secondary px-4 py-2 rounded-md text-sm font-mono"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyToClipboard(dashboardAccount.password, "Password")}
                          className="transition-smooth hover:glow-border"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full transition-smooth hover:glow-border-strong"
                    onClick={() => {
                      // TODO: Replace with actual console URL
                      toast.info("Console URL will be available after backend integration");
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Go to Console
                  </Button>

                  {user.discordId && (
                    <p className="text-xs text-center text-muted-foreground">
                      Contact email: {user.email}
                    </p>
                  )}
                </div>
              )}

              {user.discordId ? (
                <p className="text-sm text-center text-muted-foreground">
                  You can redeem and manage servers with your Discord account
                </p>
              ) : (
                <p className="text-sm text-center text-destructive">
                  ⚠️ Discord login required to create or redeem servers
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
