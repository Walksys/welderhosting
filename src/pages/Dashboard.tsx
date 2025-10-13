import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, ExternalLink, Sparkles, Server, Clock, Loader2, User, MessageCircle } from "lucide-react";

interface ServerData {
  id: string;
  server_type: "minecraft" | "bot";
  plan_name: string;
  ram: string;
  cpu: string;
  disk: string;
  max_players: string | null;
  cost_points: number;
  status: string;
  console_email: string;
  console_password: string;
  expires_at: string;
  created_at: string;
}

interface DashboardProps {
  user: {
    email: string;
    username: string;
    avatar?: string;
    discordId?: string;
  };
}

const Dashboard = ({ user }: DashboardProps) => {
  const [points, setPoints] = useState(0);
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Load profile points
      const { data: profile } = await supabase
        .from("profiles")
        .select("points, last_point_update")
        .eq("id", authUser.id)
        .single();

      if (profile) {
        setPoints(profile.points);
        
        // Check cooldown
        const lastUpdate = new Date(profile.last_point_update);
        const now = new Date();
        const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
        if (diff < 5) {
          setCooldown(5 - diff);
        }
      }

      // Load servers
      const { data: serversData } = await supabase
        .from("servers")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      if (serversData) {
        setServers(serversData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimPoint = async () => {
    if (cooldown > 0) return;
    
    setClaiming(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from("profiles")
        .update({
          points: points + 1,
          last_point_update: new Date().toISOString(),
        })
        .eq("id", authUser.id)
        .select()
        .single();

      if (error) throw error;

      setPoints(data.points);
      setCooldown(5);
      
      toast({
        title: "تم الحصول على نقطة!",
        description: "لديك الآن " + data.points + " نقطة",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setClaiming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ النص إلى الحافظة",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground">إدارة حسابك وسيرفراتك</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                الملف الشخصي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-semibold text-lg">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.discordId && (
                  <Badge className="mt-2">Discord متصل</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Points Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                نقاطك
              </CardTitle>
              <CardDescription>اجمع النقاط لشراء السيرفرات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl font-bold">{points.toLocaleString()}</div>
                <Progress value={(points / 100000) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  من {(100000).toLocaleString()} نقطة
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={claimPoint}
                    disabled={claiming || cooldown > 0}
                    className="flex-1"
                  >
                    {claiming ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : cooldown > 0 ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        {cooldown}s
                      </>
                    ) : (
                      "احصل على نقطة"
                    )}
                  </Button>
                  <Button onClick={() => navigate("/buy-server")} variant="secondary">
                    شراء سيرفر
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                الدعم
              </CardTitle>
              <CardDescription>هل تحتاج مساعدة؟</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => window.open("https://discord.gg/your-invite", "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                انضم إلى Discord
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Servers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              سيرفراتي
            </CardTitle>
            <CardDescription>
              {servers.length === 0
                ? "ليس لديك أي سيرفرات. قم بشراء سيرفر جديد!"
                : `لديك ${servers.length} ${servers.length === 1 ? "سيرفر" : "سيرفرات"}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servers.length === 0 ? (
              <div className="text-center py-8">
                <Server className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">لا توجد سيرفرات حتى الآن</p>
                <Button onClick={() => navigate("/buy-server")}>شراء سيرفر</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {servers.map((server) => (
                  <Card key={server.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{server.plan_name}</CardTitle>
                          <CardDescription>
                            {server.server_type === "minecraft" ? "Minecraft Server" : "Bot Hosting"}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={server.status === "active" ? "default" : "secondary"}
                        >
                          {server.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">RAM:</span>{" "}
                            <span className="font-medium">{server.ram}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CPU:</span>{" "}
                            <span className="font-medium">{server.cpu}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Disk:</span>{" "}
                            <span className="font-medium">{server.disk}</span>
                          </div>
                          {server.max_players && (
                            <div>
                              <span className="text-muted-foreground">Players:</span>{" "}
                              <span className="font-medium">{server.max_players}</span>
                            </div>
                          )}
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2">معلومات الدخول:</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="text-sm">{server.console_email}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(server.console_email)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="text-sm font-mono">{server.console_password}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(server.console_password)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <Button className="w-full mt-3" asChild>
                            <a
                              href="https://qjy64z-8030.csb.app"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              فتح الكونسول
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ينتهي في: {new Date(server.expires_at).toLocaleDateString("ar")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
