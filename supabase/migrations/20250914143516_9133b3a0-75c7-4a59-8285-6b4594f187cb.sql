-- Fix the search_animes function to have proper search_path
CREATE OR REPLACE FUNCTION public.search_animes(search_query text)
RETURNS SETOF public.animes 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;