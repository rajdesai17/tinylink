import { redirect } from 'next/navigation';
import { getLink, incrementClicks } from '@/lib/db';

// GET /:code - Redirect to the original URL
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const link = await getLink(code);
    
    if (!link) {
      return new Response('Not Found', { status: 404 });
    }

    // Increment click count (fire and forget)
    incrementClicks(code).catch((err) => 
      console.error('Error updating clicks:', err)
    );

    // 302 redirect
    return redirect(link.url);
  } catch (error) {
    console.error('Error redirecting:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
