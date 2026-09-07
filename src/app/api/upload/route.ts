import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Using the standard client which we'll configure below
// Wait, we need the admin client for DB inserts bypassing RLS if needed, but since uploads are anonymous it's fine.
// Actually, using the admin client is safer here so we don't depend on anonymous RLS for INSERTs.
import { supabaseAdmin } from '@/lib/supabase';

const MAX_PAYLOAD_SIZE = 5 * 1024 * 1024; // 5MB limit

export async function POST(request: Request) {
  try {
    const { dataUrl, uploadId } = await request.json();
    if (!dataUrl) {
      return NextResponse.json({ error: 'dataUrl missing' }, { status: 400 });
    }

    // Security check 1: Size limit
    // A base64 string size is approx (string.length * 3) / 4 in bytes.
    const approximateByteSize = (dataUrl.length * 3) / 4;
    if (approximateByteSize > MAX_PAYLOAD_SIZE) {
      return NextResponse.json({ error: 'Payload too large (max 5MB)' }, { status: 413 });
    }

    // Decode base64 data URL
    const matches = dataUrl.match(/^data:(image\/(jpeg|png|webp));base64,(.*)$/);
    if (!matches) {
      return NextResponse.json({ error: 'invalid dataUrl format or unsupported image type' }, { status: 400 });
    }
    const contentType = matches[1];
    const base64Data = matches[3];
    const buffer = Buffer.from(base64Data, 'base64');
    const ext = contentType.split('/')[1];
    
    const fileName = uploadId ? `photo_${uploadId}.${ext}` : `photo_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
    const publicUrl = supabase.storage.from('fotos').getPublicUrl(fileName).data.publicUrl;

    // Idempotency check: if uploadId is provided, check if it already exists in DB
    if (uploadId) {
      const { data: existingPhoto } = await supabaseAdmin
        .from('photos')
        .select('id')
        .eq('image_url', publicUrl)
        .single();
        
      if (existingPhoto) {
        return NextResponse.json({ url: publicUrl }); // Already fully processed
      }
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fotos')
      .upload(fileName, buffer, { contentType, upsert: false });
      
    if (uploadError) {
      // Ignore if the file already exists (partial failure recovery)
      const isDuplicate = uploadError.message.toLowerCase().includes('already exists') || uploadError.message.includes('Duplicate');
      if (!isDuplicate) {
        console.error('Supabase upload error:', uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }
    }

    // Insert record into database using admin to bypass RLS for inserting if anonymous inserts are restricted
    const { error: dbError } = await supabaseAdmin
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
