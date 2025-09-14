import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Anime {
  id: string;
  title: string;
  english_title: string;
  cover_image_url: string;
  status: string;
  release_year: number;
  rating: number;
  episode_count: number;
}

const AdminAnimes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [animes, setAnimes] = useState<Anime[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('auth_user_id', user.id)
        .single();

      if (error || !userData || userData.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      await loadAnimes();
    } catch (error) {
      console.error('Admin access check failed:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadAnimes = async () => {
    try {
      const { data, error } = await supabase
        .from('animes')
        .select('id, title, english_title, cover_image_url, status, release_year, rating, episode_count')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAnimes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load animes: " + error.message,
        variant: "destructive",
      });
    }
  };

  const deleteAnime = async (animeId: string, animeTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${animeTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('animes')
        .delete()
        .eq('id', animeId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Anime deleted successfully",
      });

      await loadAnimes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete anime: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Loading animes...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Manage Animes</h1>
            <p className="text-muted-foreground">
              {animes.length} anime{animes.length !== 1 ? 's' : ''} in database
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button asChild variant="outline">
              <Link to="/admin">Back to Admin</Link>
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
              <Link to="/admin/anime/new">
                <Plus className="w-4 h-4 mr-2" />
                Add New Anime
              </Link>
            </Button>
          </div>
        </div>

        {/* Animes Grid */}
        {animes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold text-foreground mb-2">No animes found</h3>
              <p className="text-muted-foreground mb-6">Start by adding your first anime to the database.</p>
              <Button asChild className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                <Link to="/admin/anime/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Anime
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animes.map((anime) => (
              <Card key={anime.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  {anime.cover_image_url ? (
                    <img
                      src={anime.cover_image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <Badge variant={anime.status === 'ongoing' ? 'default' : 'secondary'}>
                      {anime.status}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {anime.english_title || anime.title}
                  </CardTitle>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{anime.release_year}</span>
                    <span>★ {anime.rating || 'N/A'}</span>
                    <span>{anime.episode_count || 0} eps</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/anime/${anime.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/admin/anime/edit/${anime.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAnime(anime.id, anime.english_title || anime.title)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnimes;