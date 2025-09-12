import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Crown, Calendar, Clock, Settings, LogOut } from "lucide-react";
import Navigation from "@/components/Navigation";

const Profile = () => {
  // Sample user data - this will come from Supabase
  const user = {
    username: "AnimeUser123",
    email: "user@example.com",
    subscription_status: "free" as "free" | "premium",
    subscription_end_date: null,
    joined_date: "2024-01-15",
    watchTime: "127 hours",
    episodesWatched: 89
  };

  const recentlyWatched = [
    { title: "Stellar Knights", episode: 4, timestamp: "2 hours ago" },
    { title: "Mystic Academy", episode: 12, timestamp: "1 day ago" },
    { title: "Shadow Realm", episode: 7, timestamp: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-2xl text-foreground">{user.username}</CardTitle>
                <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subscription</span>
                  <Badge 
                    variant={user.subscription_status === "premium" ? "default" : "secondary"}
                    className={user.subscription_status === "premium" 
                      ? "bg-gradient-primary text-white" 
                      : "bg-muted text-muted-foreground"
                    }
                  >
                    {user.subscription_status === "premium" ? (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </>
                    ) : (
                      "Free"
                    )}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="text-foreground">{user.joined_date}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Watch Time</span>
                  <span className="text-foreground font-semibold">{user.watchTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Episodes</span>
                  <span className="text-foreground font-semibold">{user.episodesWatched}</span>
                </div>

                {user.subscription_status === "free" && (
                  <Button className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow mt-6">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6 bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-anime-primary">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-anime-primary">
                  <Crown className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-anime-primary/10 to-anime-primary/5 border-anime-primary/20">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-anime-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{user.watchTime}</p>
                  <p className="text-sm text-muted-foreground">Total Watch Time</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-anime-secondary/10 to-anime-secondary/5 border-anime-secondary/20">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-anime-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{user.episodesWatched}</p>
                  <p className="text-sm text-muted-foreground">Episodes Watched</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-anime-accent/10 to-anime-accent/5 border-anime-accent/20">
                <CardContent className="p-6 text-center">
                  <User className="w-8 h-8 text-anime-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">Member</p>
                  <p className="text-sm text-muted-foreground">Since {user.joined_date}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recently Watched */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Recently Watched</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Continue where you left off
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentlyWatched.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">Episode {item.episode}</p>
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm" className="text-anime-primary hover:text-anime-secondary">
                          Continue
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Watchlist */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">My Watchlist</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Anime you want to watch later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
                  <Button variant="outline" className="border-anime-primary text-anime-primary hover:bg-anime-primary hover:text-white">
                    Discover Anime
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;