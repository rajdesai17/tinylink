'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface LinkData {
  code: string;
  url: string;
  clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

export default function LinkTable() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data.links || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete link');

      setLinks(links.filter((link) => link.code !== code));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return <div className="text-center py-8">Loading links...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No links yet. Create your first short link above!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Short Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Original URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clicks
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {links.map((link) => (
            <tr key={link.code} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/code/${link.code}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  /{link.code}
                </Link>
              </td>
              <td className="px-6 py-4">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-blue-600 truncate max-w-md block"
                >
                  {link.url}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                {link.clicks}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                {formatDate(new Date(link.created_at))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                  onClick={() => copyToClipboard(link.code)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={() => handleDelete(link.code)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
