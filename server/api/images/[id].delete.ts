import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing image ID" });
  }

  // 1. Get image details to find storage paths
  const { data: image, error: fetchError } = await supabase
    .from("images")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !image) {
    throw createError({ statusCode: 404, statusMessage: "Image not found" });
  }

  // 2. Delete files from Storage
  const filesToDelete = [image.storage_path];
  if (image.processed_url) {
    filesToDelete.push(image.processed_url);
  }

  const { error: storageError } = await supabase.storage
    .from("images")
    .remove(filesToDelete);

  if (storageError) {
    console.error("Storage delete error:", storageError);
    // Continue to delete DB record even if storage fails (orphan cleanup)
  }

  // 3. Delete DB Record
  const { error: dbError } = await supabase
    .from("images")
    .delete()
    .eq("id", id);

  if (dbError) {
    throw createError({ statusCode: 500, statusMessage: dbError.message });
  }

  return { success: true };
});
