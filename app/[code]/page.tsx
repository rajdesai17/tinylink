import { notFound, redirect } from 'next/navigation';
import { getLink, incrementClicks } from '@/lib/db';

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  
  const link = await getLink(code);
  
  if (!link) {
    notFound();
  }

  // Increment click count (fire and forget)
  incrementClicks(code).catch((err) => 
    console.error('Error updating clicks:', err)
  );

  // 302 redirect to the original URL
  // Note: redirect() throws internally, so don't wrap in try/catch
  redirect(link.url);
}
