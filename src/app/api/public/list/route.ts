import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event = searchParams.get('event') === 'olga' ? 'olga' : 'martin';

  let data: any[] | null = null;
  let error: any = null;

  if (event === 'olga') {
    // Attempt query with event_id column first
    const res = await supabase
      .from('photos')
      .select('id, image_url, created_at, frame_id, event_id')
      .eq('is_approved', true)
      .eq('event_id', 'olga')
      .order('created_at', { ascending: false });

    if (res.error && res.error.message && res.error.message.includes('event_id')) {
      // Fallback if event_id column doesn't exist yet
      const fallbackRes = await supabase
        .from('photos')
        .select('id, image_url, created_at, frame_id')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (!fallbackRes.error && fallbackRes.data) {
        data = fallbackRes.data.filter(
          (p) => p.frame_id === 'olga-final' || p.frame_id === 'olga' || p.image_url?.includes('olga_')
        );
      } else {
        error = fallbackRes.error;
      }
    } else {
      data = res.data;
      error = res.error;
    }
  } else {
    // Martin: fetch photos where event_id is 'martin' OR is null (all previous photos belong to Martin)
    const res = await supabase
      .from('photos')
      .select('id, image_url, created_at, frame_id, event_id')
      .eq('is_approved', true)
      .or('event_id.eq.martin,event_id.is.null')
      .order('created_at', { ascending: false });

    if (res.error && res.error.message && res.error.message.includes('event_id')) {
      // Fallback if event_id column doesn't exist yet: return all photos except Olga's
      const fallbackRes = await supabase
        .from('photos')
        .select('id, image_url, created_at, frame_id')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (!fallbackRes.error && fallbackRes.data) {
        data = fallbackRes.data.filter(
          (p) => p.frame_id !== 'olga-final' && p.frame_id !== 'olga' && !p.image_url?.includes('olga_')
        );
      } else {
        error = fallbackRes.error;
      }
    } else {
      data = res.data;
      error = res.error;
    }
  }

  if (error) {
    console.error('Supabase query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform data to match what the frontend expects
  const files = (data || []).map((photo) => ({
    name: photo.id,
    url: photo.image_url,
    createdAt: photo.created_at,
  }));

  return NextResponse.json(
    { files }, 
    { 
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      } 
    }
  );
}
