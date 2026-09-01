import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
import { NextResponse } from 'next/server';

/**
 * API route to receive a JSON payload with a base64 image (photo with frame composited client‑side)
 * and store it in the Supabase public bucket. Returns the public URL.
 */
export async function POST(request: Request) {
  // O bucket "fotos" deve existir no Supabase. Se ele não existir, o upload falhará.

  try {
    const { dataUrl } = await request.json();
    if (!dataUrl) {
      return NextResponse.json({ error: 'dataUrl missing' }, { status: 400 });
    }
    // Decode base64 data URL
    const matches = dataUrl.match(/^data:(.*);base64,(.*)$/);
    if (!matches) {
      return NextResponse.json({ error: 'invalid dataUrl format' }, { status: 400 });
    }
    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `photo_${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fotos')
      .upload(fileName, buffer, { contentType, upsert: false });
    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const publicUrl = supabase.storage.from('fotos').getPublicUrl(fileName).data.publicUrl;

    // Insert record into database
    const { error: dbError } = await supabase
      .from('photos')
      .insert([{ image_url: publicUrl, is_approved: true }]);
    
    if (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    console.error('Upload route error:', e);
    return NextResponse.json({ error: 'unexpected error' }, { status: 500 });
  }
}
