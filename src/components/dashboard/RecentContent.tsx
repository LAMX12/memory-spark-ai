
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
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

const recentContent: Content[] = [
  {
    id: "1",
    title: "The Future of AI in Knowledge Management",
    excerpt: "Artificial intelligence is transforming how we organize and retrieve information. This article explores the latest trends and technologies.",
    type: "article",
    date: "2 hours ago",
    source: "Medium",
    isFavorite: true
  },
  {
    id: "2",
    title: "Building a Second Brain - Complete Course Notes",
    excerpt: "Comprehensive notes from Tiago Forte's Building a Second Brain course. Includes the CODE methodology and practical tips.",
    type: "document",
    date: "Yesterday",
    source: "PDF",
    isFavorite: false
  },
  {
    id: "3",
    title: "How to Remember Everything You Learn",
    excerpt: "This video explores the science of memory and provides practical techniques for better retention and recall.",
    type: "video",
    date: "2 days ago",
    source: "YouTube",
    isFavorite: true
  }
];

const RecentContent = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Recent Content
        </h3>
        <Button variant="link" size="sm">View all</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentContent.map((content) => (
          <ContentCard
            key={content.id}
            id={content.id}
            title={content.title}
            excerpt={content.excerpt}
            type={content.type}
            date={content.date}
            source={content.source}
            isFavorite={content.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentContent;
