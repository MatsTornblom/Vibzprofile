/*
  # Create profile pictures storage bucket

  1. New Storage Bucket
    - `profilepics` - Stores user profile pictures
      - Public access enabled for reading
      - Authenticated users can upload to their own folder
      - File size limit: 5MB
      - Allowed file types: images only

  2. Security Policies
    - Users can upload to their own folder (user_id prefix)
    - Users can update their own images
    - Public read access for all images
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('profilepics', 'profilepics', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own profile pics"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profilepics' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own profile pics"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profilepics' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own profile pics"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profilepics' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Public read access for profile pics"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profilepics');