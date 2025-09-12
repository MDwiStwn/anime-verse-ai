import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Plus, Star, Calendar, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import anime1 from "@/assets/anime1.jpg";

// Sample episode data - this will be replaced with Supabase data
const animeDetails = {
  id: "1",
  title_english: "Stellar Knights",
  title_romaji: "Stellar Knights",
  synopsis: "In a future where humanity has colonized the stars, giant mechs called Stellar Knights protect colonies from alien threats. Follow pilot Akira as he discovers his destiny among the stars and uncovers a conspiracy that threatens the entire galaxy.",
  cover_image_url: anime1,
  genres: ["Mecha", "Sci-Fi", "Action", "Drama"],
  release_year: 2024,
  rating: 9.2,
  studio: "Sunrise Studios",
  episodes: [
    { id: "1", episode_number: 1, title: "Awakening", duration: "24:30" },
    { id: "2", episode_number: 2, title: "First Contact", duration: "24:15" },
    { id: "3", episode_number: 3, title: "The Academy", duration: "23:45" },
    { id: "4", episode_number: 4, title: "Stellar Bonds", duration: "24:00" },
  ]
};

const AnimeDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${animeDetails.cover_image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <div>
              <h1 className="text-5xl font-bold mb-4 text-white">{animeDetails.title_english}</h1>
              <p className="text-xl text-gray-300 mb-6">{animeDetails.title_romaji}</p>
              
              <div className="flex items-center space-x-6 mb-6 text-white">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{animeDetails.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-5 h-5" />
                  <span>{animeDetails.release_year}</span>
                </div>
                <span>{animeDetails.studio}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {animeDetails.genres.map((genre) => (
                  <span 
                    key={genre}
                    className="px-3 py-1 bg-anime-primary/30 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-anime-primary/50"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-4">
                <Button className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-3 shadow-glow">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Episode 1
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Synopsis and Episodes */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Synopsis</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {animeDetails.synopsis}
            </p>
            
            <h3 className="text-2xl font-bold mb-6 text-foreground">Episodes</h3>
            <div className="space-y-4">
              {animeDetails.episodes.map((episode) => (
                <div 
                  key={episode.id}
                  className="bg-card rounded-lg p-6 hover:bg-card/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:shadow-glow transition-shadow">
                        {episode.episode_number}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-anime-primary transition-colors">
                          {episode.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{episode.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h3 className="text-xl font-bold mb-4 text-foreground">Details</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Studio:</span>
                  <span className="ml-2 text-foreground font-medium">{animeDetails.studio}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Year:</span>
                  <span className="ml-2 text-foreground font-medium">{animeDetails.release_year}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Episodes:</span>
                  <span className="ml-2 text-foreground font-medium">{animeDetails.episodes.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 text-anime-primary font-medium">Ongoing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnimeDetail;