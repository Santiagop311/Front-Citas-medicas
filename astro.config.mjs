// astro.config.mjs

import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  site: "https://vocal-druid-4cabbd.netlify.app", 
  base: "/", 
  output: "server",
});