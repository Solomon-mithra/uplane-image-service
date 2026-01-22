import { inngest } from "./client";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client (assuming env vars will be set)
const supabaseUrl = process.env.SUPABASE_URL || "https://example.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "mock-key";
const supabase = createClient(supabaseUrl, supabaseKey);

export const processImage = inngest.createFunction(
  { id: "process-image" },
  { event: "image/submitted" },
  async ({ event, step }) => {
    console.log("🚀 [Inngest] Function triggered!", event.data.imageId);
    const { imageId, storagePath } = event.data;

    // Step 1: Download Image
    const downloadResult = await step.run(
      "download-image",
      async () => {
        console.log("⬇️ [Inngest] Step 1: Downloading image...");
        const { data, error } = await supabase.storage
          .from("images")
          .download(storagePath);
        
        if (error) {
           console.error("❌ [Inngest] Download Error:", error);
           throw new Error(error.message);
        }
        if (!data) throw new Error("No data received");
        
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log("✅ [Inngest] Download complete. Size:", buffer.length);
        return { base64: buffer.toString('base64') };
      }
    );

    const inputBuffer = Buffer.from(downloadResult.base64, 'base64');

    // Step 2: Process and Upload
    return await step.run("process-and-upload", async () => {
         console.log("🔄 [Inngest] Step 2: Processing image...");
         
         const noBgBuffer = inputBuffer; // Mock pass-through

         // Horizontal Flip (Sharp)
         console.log("🔄 [Inngest] Flipping image...");
         let flippedBuffer;
         try {
            flippedBuffer = await sharp(noBgBuffer)
                .flop()
                .toBuffer();
             console.log("✅ [Inngest] Image flipped.");
         } catch (e) {
             console.error("❌ [Inngest] Sharp Error:", e);
             throw e;
         }

        // Upload Processed
        const processedPath = `processed/${imageId}.png`;
        console.log("⬆️ [Inngest] Uploading processed image to:", processedPath);
        
        const { error: upErr } = await supabase.storage
            .from("images")
            .upload(processedPath, flippedBuffer, { contentType: 'image/png', upsert: true });

        if (upErr) {
            console.error("❌ [Inngest] Upload Error:", upErr);
            throw new Error(`Upload failed: ${upErr.message}`);
        }

        // Update DB
        console.log("📝 [Inngest] Updating Database status...");
        const { error: dbErr } = await supabase
            .from("images")
            .update({ status: "completed", processed_url: processedPath })
            .eq("id", imageId);
            
        if (dbErr) {
            console.error("❌ [Inngest] DB Error:", dbErr);
            throw new Error(`DB Update failed: ${dbErr.message}`);
        }

        console.log("🎉 [Inngest] Processing Complete!");
        return { success: true, processedPath };
    });
  }
);
