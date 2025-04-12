
import { useEffect, useState } from "react";
import ContentCard, { ContentType } from "./ContentCard";

interface Content {
  id: string;
  title: string;
  excerpt: string;
  type: ContentType;
  date: string;
  source: string;
  isFavorite?: boolean;
}

const dummyContent: Content[] = [
  {
    id: "1",
    title: "The Future of AI in Knowledge Management",
    excerpt: "Artificial intelligence is transforming how we organize and retrieve information. This article explores the latest trends and technologies.",
    type: "article",
    date: "Apr 10, 2025",
    source: "Medium",
    isFavorite: true
  },
  {
    id: "2",
    title: "Building a Second Brain - Complete Course Notes",
    excerpt: "Comprehensive notes from Tiago Forte's Building a Second Brain course. Includes the CODE methodology and practical tips.",
    type: "document",
    date: "Apr 5, 2025",
    source: "PDF",
    isFavorite: false
  },
  {
    id: "3",
    title: "How to Remember Everything You Learn",
    excerpt: "This video explores the science of memory and provides practical techniques for better retention and recall.",
    type: "video",
    date: "Mar 28, 2025",
    source: "YouTube",
    isFavorite: true
  },
  {
    id: "4",
    title: "The PARA Method for Digital Organization",
    excerpt: "A systematic approach to organizing your digital life across Projects, Areas, Resources, and Archives.",
    type: "article",
    date: "Mar 25, 2025",
    source: "Personal Blog",
    isFavorite: false
  },
  {
    id: "5",
    title: "Effective Note-Taking Strategies for Knowledge Workers",
    excerpt: "Learn how to capture and organize notes that actually add value to your work and thinking.",
    type: "document",
    date: "Mar 20, 2025",
    source: "PDF",
    isFavorite: false
  },
  {
    id: "6",
    title: "The Science of Learning: How to Improve Knowledge Retention",
    excerpt: "A deep dive into cognitive science and practical techniques to remember more of what you learn.",
    type: "video",
    date: "Mar 15, 2025",
    source: "YouTube",
    isFavorite: false
  }
];

interface ContentGridProps {
  title: string;
  filterType?: ContentType;
  favoritesOnly?: boolean;
}

const ContentGrid = ({ title, filterType, favoritesOnly = false }: ContentGridProps) => {
  const [content, setContent] = useState<Content[]>([]);
  
  useEffect(() => {
    let filteredContent = [...dummyContent];
    
    if (filterType) {
      filteredContent = filteredContent.filter(item => item.type === filterType);
    }
    
    if (favoritesOnly) {
      filteredContent = filteredContent.filter(item => item.isFavorite);
    }
    
    setContent(filteredContent);
  }, [filterType, favoritesOnly]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <ContentCard
            key={item.id}
            id={item.id}
            title={item.title}
            excerpt={item.excerpt}
            type={item.type}
            date={item.date}
            source={item.source}
            isFavorite={item.isFavorite}
          />
        ))}
      </div>
      
      {content.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No content found.</p>
        </div>
      )}
    </div>
  );
};

export default ContentGrid;
