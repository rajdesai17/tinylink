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
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your links and view statistics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Link Form - Takes up 4 columns on large screens */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <AddLinkForm onLinkAdded={handleLinkAdded} />
          </div>

          {/* Links Table - Takes up 8 columns on large screens */}
          <div className="lg:col-span-8">
            <LinkTable key={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
}
