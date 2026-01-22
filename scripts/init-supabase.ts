
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function init() {
  console.log("Checking Supabase connection...");
  
  // 1. Check/Create Bucket
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error("Error listing buckets:", listError.message);
    return;
  }

  const existingBucket = buckets.find(b => b.name === 'images');
  
  if (existingBucket) {
    console.log("✅ Bucket 'images' already exists.");
  } else {
    console.log("Creating 'images' bucket...");
    const { data, error } = await supabase.storage.createBucket('images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    });
    
    if (error) {
      console.error("❌ Failed to create bucket:", error.message);
    } else {
      console.log("✅ Bucket 'images' created successfully.");
    }
  }
}

init();
