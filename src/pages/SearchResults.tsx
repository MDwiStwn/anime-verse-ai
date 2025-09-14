import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import AnimeCard from "@/components/AnimeCard";
import { Search, Clock } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: searchError } = await supabase
        .rpc('search_animes', { search_query: searchQuery });

      if (searchError) {
        throw searchError;
      }

      setResults(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-6 h-6 text-anime-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Search Results
            </h1>
          </div>
          
          {query && (
            <p className="text-muted-foreground mb-4">
              Showing results for: <span className="font-semibold text-foreground">"{query}"</span>
            </p>
          )}
          
          {!loading && results.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="animate-spin w-5 h-5 border-2 border-anime-primary border-t-transparent rounded-full"></div>
              <span>Searching anime...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive mb-2">Search failed</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No anime found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try searching with different keywords or check your spelling.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Try searching for:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {["action", "romance", "fantasy", "2024"].map((suggestion) => (
                  <Link
                    key={suggestion}
                    to={`/search-results?q=${encodeURIComponent(suggestion)}`}
                    className="px-3 py-1 bg-anime-primary/20 text-anime-primary rounded-full hover:bg-anime-primary/30 transition-colors"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Query */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start searching
            </h3>
            <p className="text-muted-foreground">
              Enter a search term to find your favorite anime.
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;