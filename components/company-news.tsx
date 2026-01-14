'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Newspaper, Calendar } from 'lucide-react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface CompanyNewsProps {
  companyName: string;
}

export function CompanyNews({ companyName }: CompanyNewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [companyName]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/news?company=${encodeURIComponent(companyName)}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError('Failed to load news articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Latest News & Updates
          </CardTitle>
          <CardDescription>
            Recent news and articles about {companyName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Manual News Search Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(companyName + ' fleet management news')}&tbm=nws`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Google News
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={`https://www.bing.com/news/search?q=${encodeURIComponent(companyName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Bing News
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={`https://www.reuters.com/site-search/?query=${encodeURIComponent(companyName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Reuters
                </a>
              </Button>
            </div>

            {/* Additional Search Options */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Industry-Specific News</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`https://www.freightwaves.com/?s=${encodeURIComponent(companyName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    FreightWaves
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`https://www.fleetowner.com/search?search_api_fulltext=${encodeURIComponent(companyName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Fleet Owner
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`https://www.automotive-fleet.com/search?search_api_fulltext=${encodeURIComponent(companyName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Automotive Fleet
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`https://techcrunch.com/?s=${encodeURIComponent(companyName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    TechCrunch
                  </a>
                </Button>
              </div>
            </div>

            {/* Social Media & Press */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Social & Press</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`https://twitter.com/search?q=${encodeURIComponent(companyName)}&f=live`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Twitter / X
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(companyName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    LinkedIn
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`https://www.prnewswire.com/search/news/?keyword=${encodeURIComponent(companyName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    PR Newswire
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <a
                    href={`https://www.businesswire.com/portal/site/home/search/?searchType=news&searchTerm=${encodeURIComponent(companyName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Business Wire
                  </a>
                </Button>
              </div>
            </div>

            {/* Info Card */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Newspaper className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">News Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      To see real-time news articles, integrate a news API service like NewsAPI, Google News API, or Bing News Search API.
                      The links above provide direct access to news sources where you can find the latest updates about {companyName}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
