-- Add role column to users table
ALTER TABLE public.users ADD COLUMN role text NOT NULL DEFAULT 'user';

-- Add check constraint to ensure valid roles
ALTER TABLE public.users ADD CONSTRAINT check_valid_role CHECK (role IN ('user', 'admin'));

-- Add download_url column to episodes table
ALTER TABLE public.episodes ADD COLUMN download_url text;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage animes" ON public.animes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can manage episodes" ON public.episodes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.auth_user_id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Create index for better search performance
CREATE INDEX idx_animes_search ON public.animes USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(english_title, '') || ' ' || coalesce(romaji_title, ''))
);

-- Create function to search animes
CREATE OR REPLACE FUNCTION public.search_animes(search_query text)
RETURNS SETOF public.animes AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.animes
  WHERE 
    title ILIKE '%' || search_query || '%' OR
    english_title ILIKE '%' || search_query || '%' OR  
    romaji_title ILIKE '%' || search_query || '%' OR
    synopsis ILIKE '%' || search_query || '%' OR
    EXISTS (
      SELECT 1 FROM unnest(genres) AS genre 
      WHERE genre ILIKE '%' || search_query || '%'
    )
  ORDER BY 
    CASE 
      WHEN title ILIKE search_query || '%' THEN 1
      WHEN english_title ILIKE search_query || '%' THEN 2  
      WHEN romaji_title ILIKE search_query || '%' THEN 3
      ELSE 4
    END,
    title;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.search_animes(text) TO authenticated;