import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function DELETE(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('adminToken');
  if (!token?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  // First, get the photo URL to extract the filename
  const { data: photoData, error: fetchError } = await supabaseAdmin
    .from('photos')
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError || !photoData) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  }

  const imageUrl = photoData.image_url;
  // Extract filename from URL: .../storage/v1/object/public/fotos/photo_123.jpg
  const urlParts = imageUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];

  // Delete from storage
  if (fileName) {
    await supabaseAdmin.storage.from('fotos').remove([fileName]);
  }

  // Delete from database
  const { error: dbError } = await supabaseAdmin
    .from('photos')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Supabase delete error:', dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
