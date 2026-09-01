import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdminToken } from '@/lib/jwt';

export async function GET(request: Request) {
  // Authenticate admin via Bearer token
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyAdminToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // List all objects in the "fotos" bucket
  const { data, error } = await supabase.storage.from('fotos').list('', {
    limit: 1000,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error('Supabase list error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const files = data.map((file) => {
    const { publicURL } = supabase.storage.from('fotos').getPublicUrl(file.name);
    return { name: file.name, url: publicURL };
  });

  return NextResponse.json({ files });
}
