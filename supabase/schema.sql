-- Schema setup for Fazendinha do Martin (Galeria Digital)

-- 1. Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url text NOT NULL,
    frame_id text,
    is_approved boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on photos
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can insert a new photo
CREATE POLICY "Allow public insert" ON public.photos
    FOR INSERT WITH CHECK (true);

-- Policy: Everyone can view approved photos
CREATE POLICY "Allow public select of approved photos" ON public.photos
    FOR SELECT USING (is_approved = true);

-- Policy: Authenticated users (admin) can do all
CREATE POLICY "Allow admin all access" ON public.photos
    FOR ALL USING (auth.role() = 'authenticated');


-- 2. Storage Setup (Assuming the bucket is named "fotos")
-- Note: You have to create the bucket "fotos" in the Supabase UI 
-- because standard SQL doesn't create buckets natively without calling internal functions.
-- Let's assume you created it. Here are the RLS for the storage.objects:

-- Allow public upload (only images)
CREATE POLICY "Allow public image uploads" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'fotos' 
        AND (storage.extension(name) = 'jpg' OR storage.extension(name) = 'jpeg' OR storage.extension(name) = 'png' OR storage.extension(name) = 'webp')
    );

-- Allow public select
CREATE POLICY "Allow public read" ON storage.objects
    FOR SELECT USING (bucket_id = 'fotos');

-- Allow authenticated users full control
CREATE POLICY "Allow admin storage control" ON storage.objects
    FOR ALL USING (auth.role() = 'authenticated');
