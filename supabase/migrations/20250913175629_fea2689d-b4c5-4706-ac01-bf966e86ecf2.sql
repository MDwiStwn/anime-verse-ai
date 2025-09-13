-- Create Animes table
CREATE TABLE public.animes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  english_title TEXT,
  romaji_title TEXT,
  synopsis TEXT,
  genres TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 10),
  release_year INTEGER,
  studio TEXT,
  episode_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('ongoing', 'completed', 'upcoming')) DEFAULT 'upcoming',
  cover_image_url TEXT,
  banner_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Episodes table
CREATE TABLE public.episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anime_id UUID NOT NULL REFERENCES public.animes(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  synopsis TEXT,
  duration INTEGER, -- duration in minutes
  air_date DATE,
  video_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(anime_id, episode_number)
);

-- Enable Row Level Security
ALTER TABLE public.animes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Create policies for animes table - allow all authenticated users to read
CREATE POLICY "Authenticated users can view animes" 
ON public.animes 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policies for episodes table - allow all authenticated users to read
CREATE POLICY "Authenticated users can view episodes" 
ON public.episodes 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_animes_title ON public.animes(title);
CREATE INDEX idx_animes_genres ON public.animes USING GIN(genres);
CREATE INDEX idx_animes_status ON public.animes(status);
CREATE INDEX idx_episodes_anime_id ON public.episodes(anime_id);
CREATE INDEX idx_episodes_episode_number ON public.episodes(anime_id, episode_number);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_animes_updated_at
  BEFORE UPDATE ON public.animes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();