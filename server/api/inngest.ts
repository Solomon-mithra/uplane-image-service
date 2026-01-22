import { serve } from "inngest/h3";
import { inngest } from "../inngest/client";
import { processImage } from "../inngest/functions";

export default defineEventHandler(serve({
  client: inngest,
  functions: [processImage],
}));
