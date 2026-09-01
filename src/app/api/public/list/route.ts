import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
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
