import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Em produção, deveria importar e validar o token com jwt/jose
// Mas para o MVP simplificado, apenas verificamos se o cookie existe
function isAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get('adminToken');
  return !!token?.value;
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // List all photos from the database (both approved and pending/rejected)
  const { data, error } = await supabaseAdmin
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const files = data.map((photo) => ({
    id: photo.id,
    name: `Foto ${photo.id.substring(0, 8)}`,
    url: photo.image_url,
    createdAt: photo.created_at,
    isApproved: photo.is_approved
  }));

  return NextResponse.json({ files });
}
