CREATE TABLE coaching_standards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  age_group text NOT NULL,
  key_qualities text NOT NULL,
  tactical_focus text NOT NULL,
  field_size text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
