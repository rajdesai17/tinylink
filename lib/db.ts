import { sql } from '@vercel/postgres';

export async function createLink(url: string, code: string) {
  try {
    await sql`INSERT INTO links (code, url) VALUES (${code}, ${url})`;
    return { success: true };
  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation
      return { success: false, error: 'Code already exists' };
    }
    throw error;
  }
}

export async function getLink(code: string) {
  const result = await sql`SELECT * FROM links WHERE code = ${code}`;
  return result.rows[0] || null;
}

export async function getAllLinks() {
  const result = await sql`
    SELECT * FROM links 
    ORDER BY created_at DESC
  `;
  return result.rows;
}

export async function incrementClicks(code: string) {
  await sql`
    UPDATE links 
    SET clicks = clicks + 1, 
        last_clicked_at = NOW() 
    WHERE code = ${code}
  `;
}

export async function deleteLink(code: string) {
  await sql`DELETE FROM links WHERE code = ${code}`;
}
