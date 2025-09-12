import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";

interface Anime {
  id: string;
  title_english: string;
  title_romaji: string;
  cover_image_url: string;
  genres: string[];
  release_year: number;
  rating?: number;
}

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <Link to={`/anime/${anime.id}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-premium transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={anime.cover_image_url} 
            alt={anime.title_english}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-white">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{anime.rating || "8.5"}</span>
              </div>
              <div className="bg-anime-primary/20 backdrop-blur-sm rounded-full p-2">
                <Play className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-anime-primary transition-colors">
            {anime.title_english}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">{anime.title_romaji}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{anime.release_year}</span>
            <span className="text-anime-accent font-medium">{anime.genres[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;