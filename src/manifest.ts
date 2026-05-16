/// <reference types="chrome" />

import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "My First Extension",
  version: "1.0.0",

  // permissions: ["tabs", "storage"],

  action: {
    default_popup: "index.html",
  },

  background: {
    service_worker: "src/background.ts",
    type: "module",
  },

  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content.ts"],
    },
  ],
});