import { Button } from "@/components/ui/button";
import { Play, Star, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import AnimeCard from "@/components/AnimeCard";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-anime.jpg";
import anime1 from "@/assets/anime1.jpg";
import anime2 from "@/assets/anime2.jpg";
import anime3 from "@/assets/anime3.jpg";

// Sample data - this will be replaced with Supabase data
const featuredAnime = {
  id: "1",
  title_english: "Stellar Knights",
  title_romaji: "Stellar Knights",
  synopsis: "In a future where humanity has colonized the stars, giant mechs called Stellar Knights protect colonies from alien threats. Follow pilot Akira as he discovers his destiny among the stars.",
  genres: ["Mecha", "Sci-Fi", "Action"],
  release_year: 2024,
  rating: 9.2,
  cover_image_url: anime1
};

const trendingAnimes = [
  {
    id: "1",
    title_english: "Stellar Knights",
    title_romaji: "Stellar Knights",
    cover_image_url: anime1,
    genres: ["Mecha", "Sci-Fi"],
    release_year: 2024,
    rating: 9.2
  },
  {
    id: "2", 
    title_english: "Mystic Academy",
    title_romaji: "Mystic Academy",
    cover_image_url: anime2,
    genres: ["Magic", "School"],
    release_year: 2023,
    rating: 8.8
  },
  {
    id: "3",
    title_english: "Shadow Realm",
    title_romaji: "Shadow Realm", 
    cover_image_url: anime3,
    genres: ["Dark Fantasy", "Mystery"],
    release_year: 2024,
    rating: 9.0
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              AniVerse
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Discover thousands of anime series and movies. Watch in stunning quality with our premium experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-3 text-lg shadow-glow">
                <Play className="w-5 h-5 mr-2" />
                Start Watching
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Anime */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src={featuredAnime.cover_image_url}
              alt={featuredAnime.title_english}
              className="w-full h-[600px] object-cover rounded-2xl shadow-card"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-bold text-lg">{featuredAnime.rating}</span>
                <span className="text-gray-300">• {featuredAnime.release_year}</span>
              </div>
              <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                <Play className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">{featuredAnime.title_english}</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredAnime.genres.map((genre) => (
                <span 
                  key={genre}
                  className="px-3 py-1 bg-anime-primary/20 text-anime-primary rounded-full text-sm font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {featuredAnime.synopsis}
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Trending #1</span>
              </div>
              <span>24 Episodes</span>
              <span>Action • Sci-Fi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-foreground">Trending Now</h2>
            <Button variant="ghost" className="text-anime-primary hover:text-anime-secondary">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingAnimes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;