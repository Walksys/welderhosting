import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Zap, Shield, DollarSign } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: "High Performance",
      description: "Lightning-fast servers with 99.9% uptime guarantee",
    },
    {
      icon: Shield,
      title: "DDoS Protection",
      description: "Enterprise-grade security to keep your servers safe",
    },
    {
      icon: Server,
      title: "Easy Management",
      description: "Intuitive dashboard to control all your servers",
    },
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description: "Competitive rates with flexible payment options",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold glow-text animate-fade-in">
            Premium Game Hosting
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Experience unmatched performance with Welder Hosting's cutting-edge infrastructure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button asChild size="lg" className="transition-smooth hover:glow-border-strong">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="transition-smooth hover:glow-border">
              <Link to="/auth">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 glow-text">Why Choose Welder?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card glow-border transition-smooth hover:glow-border-strong hover:scale-105"
              >
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
                  <CardTitle className="text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-card glow-border-strong text-center p-8">
            <CardHeader>
              <CardTitle className="text-4xl mb-4 glow-text">Ready to Get Started?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xl text-muted-foreground">
                Join thousands of satisfied customers hosting their servers with Welder
              </p>
              <Button asChild size="lg" className="transition-smooth hover:glow-border-strong">
                <Link to="/auth">Create Your Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
