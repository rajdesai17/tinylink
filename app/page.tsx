'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import AddLinkForm from '@/components/AddLinkForm';
import LinkTable from '@/components/LinkTable';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLinkAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TinyLink Dashboard</h1>
          <p className="text-gray-600">Create and manage your short links</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Link Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Create New Link</h2>
              <AddLinkForm onLinkAdded={handleLinkAdded} />
            </div>
          </div>

          {/* Links Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Your Links</h2>
              <LinkTable key={refreshKey} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
