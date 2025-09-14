import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface Episode {
  episode_number: number;
  title: string;
  synopsis: string;
  video_url: string;
  download_url: string;
  duration: number;
}

const AdminAnimeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    english_title: "",
    romaji_title: "",
    synopsis: "",
    cover_image_url: "",
    banner_image_url: "",
    release_year: new Date().getFullYear(),
    rating: 0,
    studio: "",
    status: "upcoming",
    genres: [] as string[]
  });
  
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [newGenre, setNewGenre] = useState("");

  useEffect(() => {
    checkAdminAccess();
    if (isEdit) {
      loadAnimeData();
    }
  }, [user, id]);

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
      }
    } catch (error) {
      console.error('Admin access check failed:', error);
      navigate('/');
    }
  };

  const loadAnimeData = async () => {
    try {
      const { data: anime, error: animeError } = await supabase
        .from('animes')
        .select('*')
        .eq('id', id)
        .single();

      if (animeError) throw animeError;

      setFormData({
        title: anime.title || "",
        english_title: anime.english_title || "",
        romaji_title: anime.romaji_title || "",
        synopsis: anime.synopsis || "",
        cover_image_url: anime.cover_image_url || "",
        banner_image_url: anime.banner_image_url || "",
        release_year: anime.release_year || new Date().getFullYear(),
        rating: anime.rating || 0,
        studio: anime.studio || "",
        status: anime.status || "upcoming",
        genres: anime.genres || []
      });

      // Load episodes
      const { data: episodesData, error: episodesError } = await supabase
        .from('episodes')
        .select('*')
        .eq('anime_id', id)
        .order('episode_number');

      if (episodesError) throw episodesError;

      setEpisodes(episodesData?.map(ep => ({
        episode_number: ep.episode_number,
        title: ep.title,
        synopsis: ep.synopsis || "",
        video_url: ep.video_url || "",
        download_url: ep.download_url || "",
        duration: ep.duration || 0
      })) || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load anime data: " + error.message,
        variant: "destructive",
      });
    }
  };

  const addGenre = () => {
    if (newGenre.trim() && !formData.genres.includes(newGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, newGenre.trim()]
      }));
      setNewGenre("");
    }
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre)
    }));
  };

  const addEpisode = () => {
    setEpisodes(prev => [...prev, {
      episode_number: prev.length + 1,
      title: "",
      synopsis: "",
      video_url: "",
      download_url: "",
      duration: 0
    }]);
  };

  const updateEpisode = (index: number, field: keyof Episode, value: any) => {
    setEpisodes(prev => prev.map((ep, i) => 
      i === index ? { ...ep, [field]: value } : ep
    ));
  };

  const removeEpisode = (index: number) => {
    setEpisodes(prev => prev.filter((_, i) => i !== index));
  };

  const saveAnime = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let animeId = id;

      if (isEdit) {
        // Update existing anime
        const { error: animeError } = await supabase
          .from('animes')
          .update({
            ...formData,
            episode_count: episodes.length
          })
          .eq('id', id);

        if (animeError) throw animeError;
      } else {
        // Create new anime
        const { data: animeData, error: animeError } = await supabase
          .from('animes')
          .insert({
            ...formData,
            episode_count: episodes.length
          })
          .select('id')
          .single();

        if (animeError) throw animeError;
        animeId = animeData.id;
      }

      // Handle episodes
      if (isEdit) {
        // Delete existing episodes
        await supabase
          .from('episodes')
          .delete()
          .eq('anime_id', id);
      }

      // Insert episodes
      if (episodes.length > 0) {
        const episodeData = episodes.map(ep => ({
          anime_id: animeId,
          episode_number: ep.episode_number,
          title: ep.title,
          synopsis: ep.synopsis || null,
          video_url: ep.video_url || null,
          download_url: ep.download_url || null,
          duration: ep.duration || null
        }));

        const { error: episodesError } = await supabase
          .from('episodes')
          .insert(episodeData);

        if (episodesError) throw episodesError;
      }

      toast({
        title: "Success",
        description: `Anime ${isEdit ? 'updated' : 'created'} successfully`,
      });

      navigate('/admin/animes');

    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} anime: ` + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isEdit ? 'Edit Anime' : 'Add New Anime'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update anime information and episodes' : 'Create a new anime entry with episodes'}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button asChild variant="outline">
              <Link to="/admin/animes">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to List
              </Link>
            </Button>
            <Button 
              onClick={saveAnime}
              disabled={loading}
              className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Anime'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Anime Details */}
          <Card>
            <CardHeader>
              <CardTitle>Anime Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Original title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">English Title</label>
                <Input
                  value={formData.english_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, english_title: e.target.value }))}
                  placeholder="English title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Romaji Title</label>
                <Input
                  value={formData.romaji_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, romaji_title: e.target.value }))}
                  placeholder="Romaji title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Synopsis</label>
                <Textarea
                  value={formData.synopsis}
                  onChange={(e) => setFormData(prev => ({ ...prev, synopsis: e.target.value }))}
                  placeholder="Anime description..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Release Year</label>
                  <Input
                    type="number"
                    value={formData.release_year}
                    onChange={(e) => setFormData(prev => ({ ...prev, release_year: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Studio</label>
                <Input
                  value={formData.studio}
                  onChange={(e) => setFormData(prev => ({ ...prev, studio: e.target.value }))}
                  placeholder="Animation studio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-primary text-foreground"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cover Image URL</label>
                <Input
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Banner Image URL</label>
                <Input
                  value={formData.banner_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, banner_image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Genres</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Add genre"
                    onKeyPress={(e) => e.key === 'Enter' && addGenre()}
                  />
                  <Button type="button" onClick={addGenre} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="cursor-pointer" onClick={() => removeGenre(genre)}>
                      {genre} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Episodes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Episodes ({episodes.length})</CardTitle>
                <Button onClick={addEpisode} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Episode
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {episodes.map((episode, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Episode {episode.episode_number}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEpisode(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Input
                      value={episode.title}
                      onChange={(e) => updateEpisode(index, 'title', e.target.value)}
                      placeholder="Episode title"
                    />
                    
                    <Textarea
                      value={episode.synopsis}
                      onChange={(e) => updateEpisode(index, 'synopsis', e.target.value)}
                      placeholder="Episode synopsis"
                      className="min-h-[60px]"
                    />
                    
                    <Input
                      value={episode.video_url}
                      onChange={(e) => updateEpisode(index, 'video_url', e.target.value)}
                      placeholder="Video streaming URL"
                    />
                    
                    <Input
                      value={episode.download_url}
                      onChange={(e) => updateEpisode(index, 'download_url', e.target.value)}
                      placeholder="Download URL (optional)"
                    />
                    
                    <Input
                      type="number"
                      value={episode.duration}
                      onChange={(e) => updateEpisode(index, 'duration', parseInt(e.target.value) || 0)}
                      placeholder="Duration (seconds)"
                    />
                  </div>
                ))}

                {episodes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No episodes added yet.</p>
                    <Button onClick={addEpisode} variant="outline" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Episode
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnimeForm;