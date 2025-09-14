import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import VideoPlayer from "@/components/VideoPlayer";
import AnimeCard from "@/components/AnimeCard";
import { supabase } from "@/integrations/supabase/client";
import anime1 from "@/assets/anime1.jpg";
import anime2 from "@/assets/anime2.jpg";
import anime3 from "@/assets/anime3.jpg";

const Watch = () => {
  const { episodeId } = useParams();
  const [episode, setEpisode] = useState<any>(null);
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch episode data
        const { data: episodeData, error: episodeError } = await supabase
          .from('episodes')
          .select('*')
          .eq('id', episodeId)
          .single();

        if (episodeError) {
          throw new Error('Episode not found');
        }

        setEpisode(episodeData);

        // Fetch anime data
        const { data: animeData, error: animeError } = await supabase
          .from('animes')
          .select('*')
          .eq('id', episodeData.anime_id)
          .single();

        if (animeError) {
          throw new Error('Anime not found');
        }

        setAnime(animeData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (episodeId) {
      fetchEpisodeData();
    }
  }, [episodeId]);

  const relatedAnimes = [
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

  // Sample user subscription - this will come from Supabase auth
  const userSubscription = "free"; // or "premium"

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Loading episode...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !episode || !anime) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-destructive">
              {error || 'Episode not found'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-3">
            <VideoPlayer 
              episodeId={episode.id}
              title={`${anime.title || anime.english_title} - ${episode.title}`}
              videoUrl={episode.video_url}
              userSubscription={userSubscription as "free" | "premium"}
            />
            
            {/* Episode Info */}
            <div className="mt-6 bg-card rounded-lg p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {anime.title || anime.english_title}
                  </h1>
                  <h2 className="text-xl text-muted-foreground mb-2">
                    Episode {episode.episode_number}: {episode.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {episode.synopsis || "No description available."}
                  </p>
                </div>
              </div>
              
              {/* Episode Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div>
                  {episode.prev_episode && (
                    <button className="text-anime-primary hover:text-anime-secondary font-medium">
                      ← Previous Episode
                    </button>
                  )}
                </div>
                <div>
                  {episode.next_episode && (
                    <button className="bg-gradient-primary text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium shadow-glow">
                      Next Episode →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Download Section */}
            {episode.download_url && (
              <div className="mt-6 bg-card rounded-lg p-6 shadow-card">
                <h3 className="text-xl font-bold text-foreground mb-4">Download</h3>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Download Episode {episode.episode_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      High quality video file for offline viewing
                    </p>
                  </div>
                  <a
                    href={episode.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-primary text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium shadow-glow transition-opacity"
                  >
                    Download Video
                  </a>
                </div>
              </div>
            )}

            {/* Comments Section Placeholder */}
            <div className="mt-6 bg-card rounded-lg p-6 shadow-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Comments</h3>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Comments will be available after Supabase integration
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Episode List */}
            <div className="bg-card rounded-lg p-6 shadow-card mb-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Episodes</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((ep) => (
                  <div
                    key={ep}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      ep === parseInt(episode.id)
                        ? 'bg-gradient-primary text-white'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Episode {ep}</span>
                      <span className="text-sm opacity-80">24:30</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Anime */}
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">You Might Like</h3>
              <div className="space-y-4">
                {relatedAnimes.map((anime) => (
                  <div key={anime.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                    <img 
                      src={anime.cover_image_url}
                      alt={anime.title_english}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm line-clamp-2">
                        {anime.title_english}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {anime.release_year} • {anime.genres[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;