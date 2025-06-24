import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "../../components/dashboard/Sidebar";

interface NewsArticle { id: number; headline: string; source: string; url: string; image: string; summary: string; datetime: number; }

async function getNews(): Promise<NewsArticle[]> {
  try {
    const finnhubToken = process.env.FINNHUB_API_KEY;
    const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${finnhubToken}`);
    if (!response.ok) throw new Error("Failed to fetch news");
    const rawNews = await response.json();
    return rawNews.slice(0, 30).map((article: any) => ({
      id: article.id,
      headline: article.headline,
      source: article.source,
      url: article.url,
      image: article.image,
      summary: article.summary,
      datetime: article.datetime,
    }));
  } catch (error) {
    console.error("Failed to fetch Finnhub news:", error);
    return [];
  }
}

export default async function NewsPage() {
  const newsData: NewsArticle[] = await getNews();
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">Latest Market News</h2>
          <p className="text-gray-400">Stay up-to-date with the latest headlines from around the globe.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {newsData.map(article => (
            <a href={article.url} key={article.id} target="_blank" rel="noopener noreferrer" className="block h-full">
              <Card className="bg-gray-900 border-gray-800 text-white h-full flex flex-col hover:border-green-500/50 transition-all">
                {article.image && (
                  <div className="relative w-full h-40">
                    <Image src={article.image} alt={article.headline} layout="fill" objectFit="cover" className="rounded-t-lg" />
                  </div>
                )}
                <CardHeader><CardTitle className="leading-tight">{article.headline}</CardTitle></CardHeader>
                <CardContent className="flex-grow"><p className="text-sm text-gray-400">{article.summary.substring(0, 100)}...</p></CardContent>
                <CardFooter className="text-xs text-gray-500"><p>{article.source} • {new Date(article.datetime * 1000).toLocaleDateString()}</p></CardFooter>
              </Card>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}