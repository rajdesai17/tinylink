import { NextResponse } from 'next/server';
import { createLinkSchema } from '@/lib/validations';
import { createLink, getAllLinks } from '@/lib/db';
import { generateCode } from '@/lib/utils';

// POST /api/links - Create a new short link
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createLinkSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { url, code } = validation.data;
    const finalCode = code || generateCode();
    
    const result = await createLink(url, finalCode);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 409 }
      );
    }

    return NextResponse.json({ code: finalCode, url }, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/links - Get all links
export async function GET() {
  try {
    const links = await getAllLinks();
    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
