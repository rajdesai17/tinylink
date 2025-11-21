import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
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
      notFound();
    }

    // Increment click count (fire and forget)
    incrementClicks(code).catch((err) => 
      console.error('Error updating clicks:', err)
    );

    // 302 redirect to the original URL
    return NextResponse.redirect(link.url, { status: 302 });
  } catch (error) {
    console.error('Error redirecting:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
