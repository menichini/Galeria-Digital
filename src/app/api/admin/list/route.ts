import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function isAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get('adminToken');
  return !!token?.value;
}

export async function GET(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filterEvent = searchParams.get('event'); // 'all', 'martin', or 'olga'

  // List all photos from the database (both approved and pending/rejected)
  const { data, error } = await supabaseAdmin
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let files = data.map((photo) => {
    const isOlga = photo.event_id === 'olga' || photo.frame_id === 'olga-final' || photo.frame_id === 'olga' || photo.image_url?.includes('olga_');
    const eventId = isOlga ? 'olga' : 'martin';

    return {
      id: photo.id,
      name: `Foto ${photo.id.substring(0, 8)}`,
      url: photo.image_url,
      createdAt: photo.created_at,
      isApproved: photo.is_approved,
      eventId,
    };
  });

  if (filterEvent && filterEvent !== 'all') {
    files = files.filter((f) => f.eventId === filterEvent);
  }

  return NextResponse.json({ files });
}
