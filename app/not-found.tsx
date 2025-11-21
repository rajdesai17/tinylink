import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-16">
          {/* Error Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl"></div>
            <div className="relative bg-destructive/10 p-6 rounded-full">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
          </div>

          {/* Error Message Card */}
          <Card className="w-full max-w-2xl border-none shadow-none sm:border sm:shadow-lg">
            <CardHeader className="space-y-4">
              <CardTitle className="text-4xl font-bold tracking-tight text-gray-900">404 - Link Not Found</CardTitle>
              <CardDescription className="text-lg">
                The short link you&apos;re looking for doesn&apos;t exist or has been deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  This could happen if:
                </p>
                <ul className="text-sm text-muted-foreground text-left list-disc list-inside space-y-1">
                  <li>The link has been deleted by its creator</li>
                  <li>The short code was typed incorrectly</li>
                  <li>The link expired or never existed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
