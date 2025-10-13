import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Server, Bot, Check } from "lucide-react";

interface BuyServerProps {
  userPoints: number;
  onPurchaseComplete: () => void;
}

const MINECRAFT_PLANS = [
  { name: "2GB Plan", ram: "2GB", cpu: "100%", disk: "5GB", players: "20", points: 0 },
  { name: "3GB Plan", ram: "3GB", cpu: "150%", disk: "10GB", players: "40", points: 15000 },
  { name: "4.5GB Plan", ram: "4.5GB", cpu: "250%", disk: "15GB", players: "70", points: 25000 },
  { name: "6GB Plan", ram: "6GB", cpu: "300%", disk: "20GB", players: "100", points: 30000 },
  { name: "8GB Plan", ram: "8GB", cpu: "400%", disk: "30GB", players: "150", points: 40000 },
  { name: "12GB Plan", ram: "12GB", cpu: "500%", disk: "35GB", players: "225", points: 50000 },
  { name: "16GB Plan", ram: "16GB", cpu: "600%", disk: "40GB", players: "300", points: 85000 },
  { name: "32GB Plan", ram: "32GB", cpu: "800%", disk: "50GB", players: "600", points: 135000 },
];

const BOT_PLANS = [
  { name: "Starter", ram: "256MB", cpu: "20%", disk: "1GB", players: null, points: 20000 },
  { name: "Starter+", ram: "512MB", cpu: "25%", disk: "2GB", players: null, points: 50000 },
  { name: "Advanced", ram: "1GB", cpu: "50%", disk: "3GB", players: null, points: 65000 },
  { name: "Advanced+", ram: "2GB", cpu: "100%", disk: "4GB", players: null, points: 100000 },
  { name: "Pro", ram: "4GB", cpu: "150%", disk: "6GB", players: null, points: 140000 },
];

const BuyServer = ({ userPoints, onPurchaseComplete }: BuyServerProps) => {
  const [purchasing, setPurchasing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePurchase = async (
    serverType: "minecraft" | "bot",
    plan: typeof MINECRAFT_PLANS[0] | typeof BOT_PLANS[0]
  ) => {
    if (userPoints < plan.points) {
      toast({
        title: "نقاط غير كافية",
        description: `تحتاج إلى ${plan.points.toLocaleString()} نقطة للشراء. لديك ${userPoints.toLocaleString()} نقطة فقط.`,
        variant: "destructive",
      });
      return;
    }

    setPurchasing(true);

    try {
      const { data, error } = await supabase.rpc("purchase_server", {
        p_server_type: serverType,
        p_plan_name: plan.name,
        p_ram: plan.ram,
        p_cpu: plan.cpu,
        p_disk: plan.disk,
        p_max_players: plan.players || "",
        p_cost_points: plan.points,
      });

      if (error) throw error;

      toast({
        title: "تم الشراء بنجاح!",
        description: "تم إنشاء السيرفر الخاص بك. يمكنك عرضه في لوحة التحكم.",
      });

      onPurchaseComplete();
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "فشل الشراء",
        description: error.message || "حدث خطأ أثناء شراء السيرفر",
        variant: "destructive",
      });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">شراء سيرفر</h1>
          <p className="text-muted-foreground">
            لديك <span className="font-bold text-primary">{userPoints.toLocaleString()}</span> نقطة
          </p>
        </div>

        <Tabs defaultValue="minecraft" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="minecraft">
              <Server className="w-4 h-4 mr-2" />
              Minecraft
            </TabsTrigger>
            <TabsTrigger value="bot">
              <Bot className="w-4 h-4 mr-2" />
              Bot Hosting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="minecraft" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MINECRAFT_PLANS.map((plan) => (
                <Card key={plan.name} className="relative">
                  {plan.points === 0 && (
                    <Badge className="absolute top-4 right-4">مجاني</Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.points === 0 ? "مجاني" : `${plan.points.toLocaleString()} نقطة`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">RAM:</span>
                        <span className="font-medium">{plan.ram}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">CPU:</span>
                        <span className="font-medium">{plan.cpu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Disk:</span>
                        <span className="font-medium">{plan.disk}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Players:</span>
                        <span className="font-medium">{plan.players}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handlePurchase("minecraft", plan)}
                      disabled={purchasing || userPoints < plan.points}
                    >
                      {purchasing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : userPoints >= plan.points ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          شراء
                        </>
                      ) : (
                        "نقاط غير كافية"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bot" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BOT_PLANS.map((plan) => (
                <Card key={plan.name}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.points.toLocaleString()} نقطة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">RAM:</span>
                        <span className="font-medium">{plan.ram}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">CPU:</span>
                        <span className="font-medium">{plan.cpu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Storage:</span>
                        <span className="font-medium">{plan.disk}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handlePurchase("bot", plan)}
                      disabled={purchasing || userPoints < plan.points}
                    >
                      {purchasing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : userPoints >= plan.points ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          شراء
                        </>
                      ) : (
                        "نقاط غير كافية"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyServer;
