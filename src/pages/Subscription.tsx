import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Star, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";

const Subscription = () => {
  const features = {
    free: [
      "Access to 1000+ anime series",
      "480p streaming quality",
      "Limited ads",
      "Community features"
    ],
    premium: [
      "Access to entire library",
      "4K Ultra HD streaming",
      "No ads experience", 
      "Download for offline viewing",
      "Early access to new episodes",
      "Premium-only exclusive content",
      "Multi-device streaming",
      "Priority customer support"
    ]
  };

  const handleSubscribe = () => {
    // This will be connected to Stripe integration
    console.log("Starting subscription process...");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-anime-primary/10 via-background to-anime-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-anime-primary/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Crown className="w-5 h-5 text-anime-primary" />
            <span className="text-anime-primary font-medium">Premium Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Unlock Premium
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Experience anime like never before with Ultra HD streaming, exclusive content, and an ad-free experience
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground mb-12">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-anime-accent" />
              <span>Instant activation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-anime-accent" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Free</CardTitle>
              <CardDescription className="text-muted-foreground">
                Great for casual anime watching
              </CardDescription>
              <div className="text-4xl font-bold text-foreground">
                $0<span className="text-lg text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-anime-accent flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gradient-to-br from-anime-primary/5 to-anime-secondary/5 border-anime-primary shadow-premium relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-primary rounded-full px-3 py-1 text-xs font-bold text-white shadow-glow">
                MOST POPULAR
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center space-x-2">
                <Crown className="w-6 h-6 text-anime-primary" />
                <span>Premium</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                The ultimate anime streaming experience
              </CardDescription>
              <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                $9.99<span className="text-lg text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-anime-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={handleSubscribe}
                className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold shadow-glow"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Cancel anytime • 7-day free trial
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Choose Premium?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Ultra HD Quality</h3>
              <p className="text-muted-foreground">
                Watch your favorite anime in stunning 4K resolution with crystal clear audio
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Exclusive Content</h3>
              <p className="text-muted-foreground">
                Access premium-only anime series and get early access to new episodes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Ad-Free Experience</h3>
              <p className="text-muted-foreground">
                Enjoy uninterrupted anime streaming without any advertisements
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscription;