
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentCard from "@/components/dashboard/ContentCard";
import { Search, Loader2 } from "lucide-react";
import contentService, { Content } from "@/lib/content";
import { useAuth } from "@/contexts/AuthContext";

const SmartSearch = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get("q");
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [location.search]);
  
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || !user) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Here we'd ideally use semantic search with embeddings
      // For now, we'll use the simple search function
      const results = contentService.searchContent(searchQuery, user.id);
      
      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };
  
  const filterResultsByType = (type: string): Content[] => {
    if (type === "all") return searchResults;
    return searchResults.filter(item => item.type === type);
  };
  
  const filteredResults = filterResultsByType(activeTab);
  
  // Count results by type for the tabs
  const resultCounts = {
    all: searchResults.length,
    pdf: searchResults.filter(item => item.type === "pdf").length,
    document: searchResults.filter(item => item.type === "document").length,
    email: searchResults.filter(item => item.type === "email").length,
    video: searchResults.filter(item => item.type === "video").length,
    article: searchResults.filter(item => item.type === "article").length,
    note: searchResults.filter(item => item.type === "note").length,
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Smart Search</h1>
          <p className="text-muted-foreground mb-6">
            Search across all your content using natural language
          </p>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What was that pricing tip from last week's PDF?"
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" size="lg" disabled={isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Search
            </Button>
          </form>
        </div>
        
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full max-w-3xl">
                <TabsTrigger value="all">All ({resultCounts.all})</TabsTrigger>
                <TabsTrigger value="pdf">PDFs ({resultCounts.pdf})</TabsTrigger>
                <TabsTrigger value="document">Documents ({resultCounts.document})</TabsTrigger>
                <TabsTrigger value="email">Emails ({resultCounts.email})</TabsTrigger>
                <TabsTrigger value="video">Videos ({resultCounts.video})</TabsTrigger>
                <TabsTrigger value="article">Articles ({resultCounts.article})</TabsTrigger>
                <TabsTrigger value="note">Notes ({resultCounts.note})</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                {filteredResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.map((item) => (
                      <ContentCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        excerpt={item.summary || ""}
                        type={item.type as any}
                        date={new Date(item.date).toLocaleDateString()}
                        source={item.source}
                        isFavorite={item.isFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No {activeTab !== "all" ? activeTab : ""} content found for "{query}"</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {query && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No results found for "{query}"</p>
            <p className="text-sm text-muted-foreground mt-2">Try different keywords or add some content to your Second Brain</p>
          </div>
        )}
        
        {!query && !isSearching && (
          <div className="text-center py-12">
            <p className="text-lg">Start typing to search your Second Brain</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try searching for concepts, questions, or specific content
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SmartSearch;
