import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

async function getLinkStats(code: string) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/links/${code}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
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

  const shortUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${link.code}`;

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
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl);
                    alert('Copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Copy
                </button>
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
