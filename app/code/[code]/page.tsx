import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { CopyButton } from '@/components/CopyButton';
import { getLink } from '@/lib/db';

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

  // Get base URL from environment or headers
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'https://tinylink-kappa-sandy.vercel.app';
  const shortUrl = `${baseUrl}/${link.code}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-6">Link Statistics</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <CopyButton text={shortUrl} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original URL
              </label>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {link.url}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {link.clicks}
                </div>
                <div className="text-sm text-gray-600">Total Clicks</div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-lg font-semibold text-green-600 mb-2">
                  {new Date(link.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Created On</div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Test Link
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
