import { useToast } from "@/hooks/use-toast";
import { BookOpen, FileText, MoreVertical, Star, Video, Mail, Bookmark } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type ContentType = "pdf" | "document" | "email" | "video" | "article" | "note";

interface ContentCardProps {
  id: string;
  title: string;
  excerpt: string;
  type: ContentType;
  date: string;
  source: string;
  isFavorite?: boolean;
}

const ContentCard = ({
  id,
  title,
  excerpt,
  type,
  date,
  source,
  isFavorite = false
}: ContentCardProps) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const { toast } = useToast();
  
  const getTypeIcon = () => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-400" />;
      case "document":
        return <FileText className="h-4 w-4 text-blue-400" />;
      case "email":
        return <Mail className="h-4 w-4 text-purple-400" />;
      case "video":
        return <Video className="h-4 w-4 text-red-400" />;
      case "article":
        return <BookOpen className="h-4 w-4 text-green-400" />;
      case "note":
        return <Bookmark className="h-4 w-4 text-yellow-400" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const toggleFavorite = () => {
    setFavorite(!favorite);
    toast({
      title: favorite ? "Removed from favorites" : "Added to favorites",
      description: favorite ? "Item removed from your favorites" : "Item added to your favorites"
    });
  };

  return (
    <Card className="glass-card hover:shadow-glow transition-shadow group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex space-x-2 items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {getTypeIcon()}
            </div>
            <div className="text-xs text-muted-foreground">
              {source} • {date}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleFavorite}>
                {favorite ? "Remove from favorites" : "Add to favorites"}
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-3">
          <h3 className="font-bold text-lg line-clamp-2">{title}</h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-3">{excerpt}</p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="text-xs">
          Open
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${favorite ? "text-yellow-400" : "text-muted-foreground"}`}
          onClick={toggleFavorite}
        >
          <Star className={`h-4 w-4 ${favorite ? "fill-yellow-400" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
