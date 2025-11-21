import { NextResponse } from 'next/server';
import { getLink, deleteLink } from '@/lib/db';

// GET /api/links/:code - Get link details and stats
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const link = await getLink(params.code);

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/links/:code - Delete a link
export async function DELETE(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const link = await getLink(params.code);
    
    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    await deleteLink(params.code);

    return NextResponse.json(
      { message: 'Link deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
