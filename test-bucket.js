import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkBucket() {
  const { data, error } = await supabase.storage.getBucket('aletta-storage');
  if (error) {
    console.log("Bucket not found or error:", error.message);
    const { data: createData, error: createError } = await supabase.storage.createBucket('aletta-storage', { public: true });
    if (createError) {
      console.log("Failed to create bucket:", createError.message);
    } else {
      console.log("Bucket created successfully!");
    }
  } else {
    console.log("Bucket exists:", data);
  }
}
checkBucket();
