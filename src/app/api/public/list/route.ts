import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('photos')
    .select('id, image_url, created_at')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform data to match what the frontend expects
  const files = data.map((photo) => ({
    name: photo.id, // using id as a unique key/name
    url: photo.image_url,
    createdAt: photo.created_at
  }));

  return NextResponse.json({ files });
}
