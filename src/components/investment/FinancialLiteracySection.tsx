import React, { useState } from 'react';
import { Play, BookOpen, TrendingUp, PiggyBank, Shield, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  category: string;
  duration: string;
}

const FINANCIAL_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Understanding Personal Loans',
    description: 'Learn the basics of personal loans, interest rates, and how to choose the right one.',
    thumbnail: 'https://img.youtube.com/vi/WEDIj9JBTC8/maxresdefault.jpg',
    youtubeId: 'WEDIj9JBTC8',
    category: 'Loans',
    duration: '8:45',
  },
  {
    id: '2',
    title: 'How to Improve Your Credit Score',
    description: 'Expert tips on building and maintaining a healthy credit score for better loan terms.',
    thumbnail: 'https://img.youtube.com/vi/Vn9ounAgG3w/maxresdefault.jpg',
    youtubeId: 'Vn9ounAgG3w',
    category: 'Credit',
    duration: '12:30',
  },
  {
    id: '3',
    title: 'Smart Investment Strategies',
    description: 'Beginner-friendly guide to mutual funds, SIPs, and wealth building strategies.',
    thumbnail: 'https://img.youtube.com/vi/p7HKvqRI_Bo/maxresdefault.jpg',
    youtubeId: 'p7HKvqRI_Bo',
    category: 'Investing',
    duration: '15:20',
  },
  {
    id: '4',
    title: 'EMI Planning & Budgeting',
    description: 'How to plan your EMIs effectively without straining your monthly budget.',
    thumbnail: 'https://img.youtube.com/vi/HQzoZfc3GwQ/maxresdefault.jpg',
    youtubeId: 'HQzoZfc3GwQ',
    category: 'Budgeting',
    duration: '10:15',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'Loans', label: 'Loans', icon: TrendingUp },
  { id: 'Investing', label: 'Investing', icon: PiggyBank },
  { id: 'Credit', label: 'Credit', icon: Shield },
];

export function FinancialLiteracySection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = selectedCategory === 'all' 
    ? FINANCIAL_VIDEOS 
    : FINANCIAL_VIDEOS.filter(v => v.category === selectedCategory);

  return (
    <section className="py-20 px-4 bg-gradient-dark relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(217,91%,60%,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(45,93%,58%,0.05),transparent_50%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <BookOpen size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Financial Education</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Learn & <span className="text-gradient-primary">Grow</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Free financial literacy resources to help you make smarter borrowing and investment decisions.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200',
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <category.icon size={16} />
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video, index) => (
            <div
              key={video.id}
              className={cn(
                'glass rounded-2xl overflow-hidden cursor-pointer group',
                'hover:border-primary/30 transition-all duration-300',
                'hover:transform hover:-translate-y-1',
                'animate-fade-up'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedVideo(video)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                    <Play size={24} className="text-primary-foreground ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-background/80 text-xs text-foreground">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary/90 text-xs text-primary-foreground font-medium">
                  {video.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <a
            href="https://www.youtube.com/results?search_query=personal+finance+india"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <span className="font-medium">View more educational content</span>
            <ChevronRight size={18} />
          </a>
        </div>
      </div>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="font-display text-xl">{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <div className="p-4">
            <p className="text-muted-foreground">{selectedVideo?.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
