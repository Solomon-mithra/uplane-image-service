import { inngest } from "./client";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from 'cloudinary';
import sharp from "sharp";

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const processImage = inngest.createFunction(
  { id: "process-image" },
  { event: "image/submitted" },
  async ({ event, step }) => {
    console.log("🚀 [Inngest] Function triggered!", event.data.imageId);
    const { imageId, storagePath } = event.data;

    // Step 1: Download Image from Supabase
    const downloadResult = await step.run("download-image", async () => {
        console.log("⬇️ [Inngest] Downloading image from Supabase...");
        const { data, error } = await supabase.storage
          .from("images")
          .download(storagePath);
        
        if (error) throw new Error(error.message);
        if (!data) throw new Error("No data received");
        
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return { base64: buffer.toString('base64') };
    });

    const inputBuffer = Buffer.from(downloadResult.base64, 'base64');

    // Step 2: Upload to Cloudinary (Just for hosting/AI access)
    await step.run("upload-to-cloudinary", async () => {
        console.log("☁️ [Inngest] Uploading to Cloudinary...");
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { public_id: imageId },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(inputBuffer);
        });
    });

    // Step 3: Fetch Cloudinary Image with Background Removal Effect
    const bgRemovedBuffer = await step.run("fetch-ai-result", async () => {
        const aiUrl = cloudinary.url(imageId, {
            effect: "background_removal"
        });
        
        console.log("🎨 [Inngest] Fetching AI Background Removal from:", aiUrl);
        const response = await fetch(aiUrl);
        if (!response.ok) throw new Error(`Failed to fetch Cloudinary image: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        return { base64: Buffer.from(arrayBuffer).toString('base64') };
    });

    // Step 4: Flip Horizontal using Sharp
    const flippedBufferBase64 = await step.run("sharp-flip-image", async () => {
        console.log("🔄 [Inngest] Flipping image with Sharp...");
        const input = Buffer.from(bgRemovedBuffer.base64, 'base64');
        
        const outputBuffer = await sharp(input)
            .flop() // Horizontal flip
            .toBuffer();
            
        return { base64: outputBuffer.toString('base64') };
    });

    // Step 5: Upload Final to Supabase
    const supabaseUpload = await step.run("save-to-supabase", async () => {
         const processedPath = `processed/${imageId}.png`;
         const buffer = Buffer.from(flippedBufferBase64.base64, 'base64');
         
         console.log("⬆️ [Inngest] Uploading final processed image to Supabase...");
         const { error } = await supabase.storage
            .from("images")
            .upload(processedPath, buffer, { contentType: 'image/png', upsert: true });

         if (error) throw new Error(error.message);
         return { processedPath };
    });

    // Step 6: Update Database
    await step.run("update-database", async () => {
        const { error } = await supabase
            .from("images")
            .update({ 
                status: "completed", 
                processed_url: supabaseUpload.processedPath 
            })
            .eq("id", imageId);
            
        if (error) throw new Error(error.message);
    });

    console.log("🎉 [Inngest] Hybrid Processing Complete!");
    return { success: true };
  }
);
