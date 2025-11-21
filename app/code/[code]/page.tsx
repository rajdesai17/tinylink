import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MousePointer2, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import { CopyButton } from '@/components/CopyButton';
import { getLink } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

async function getLinkStats(code: string) {
  try {
    const link = await getLink(code);
    return link;
  } catch (error) {
    console.error('Error fetching link stats:', error);
    return null;
  }
}

export default async function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const link = await getLinkStats(code);

  if (!link) {
    notFound();
  }

  // Get base URL from environment or use production URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'https://tinylink-kappa-sandy.vercel.app';
  const fullShortUrl = `${baseUrl}/${link.code}`;
  const shortPath = `/${link.code}`;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Link Statistics</CardTitle>
            <CardDescription>Detailed analytics for your short link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Short URL</Label>
                <div className="flex items-center gap-2">
                  <Input value={fullShortUrl} readOnly className="font-mono bg-muted" />
                  <CopyButton text={fullShortUrl} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Original URL</Label>
                <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/50">
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {link.url}
                  </a>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    <MousePointer2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-1">
                    {link.clicks}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Total Clicks</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-muted rounded-full mb-4">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-xl font-semibold mb-1">
                    {new Date(link.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Created On</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a
                  href={shortPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Visit Short Link
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
