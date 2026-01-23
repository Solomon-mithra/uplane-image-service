import { readMultipartFormData } from "h3";
import { createClient } from "@supabase/supabase-js";
import { inngest } from "../inngest/client";
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase (Server-side only)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async (event) => {

  const files = await readMultipartFormData(event);
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }

  // Assume single file upload (first field is the file)
  const file = files[0];

  // 5MB Server-Side Check
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 413, statusMessage: "File too large. Max 5MB." });
  }

  const filename = file.filename || "upload.png";
  const fileExt = filename.split('.').pop();
  const imageId = uuidv4();
  const uniqueFilename = `${imageId}.${fileExt}`;
  const storagePath = `raw/${uniqueFilename}`;

  // 2. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(storagePath, file.data, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    throw createError({ statusCode: 500, statusMessage: `Upload failed: ${uploadError.message}` });
  }

  // 3. Create DB Record (Metadata)
  const { error: dbError } = await supabase
    .from("images")
    .insert({
      id: imageId,
      original_filename: filename,
      storage_path: storagePath,
      status: "pending", // pending -> processing -> completed
    });

  if (dbError) {
     // Cleanup storage if DB fails? For now, keep it simple.
     throw createError({ statusCode: 500, statusMessage: `DB Insert failed: ${dbError.message}` });
  }

  // 4. Trigger Inngest Workflow
  await inngest.send({
    name: "image/submitted",
    data: {
      imageId,
      storagePath,
    },
  });

  return {
    success: true,
    imageId,
    message: "Image uploaded and processing started.",
  };
});
