import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import starlight from "@astrojs/starlight";
import fs from "node:fs";

// https://astro.build/config
export default defineConfig({
  site: "https://c3-web.github.io",
  base: "/c3-web",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    starlight({
      title: "The C3 Handbook",
      expressiveCode: {
        shiki: {
          langs: [JSON.parse(fs.readFileSync("./c3-grammar.json", "utf-8"))],
        },
      },
    }),
  ],
});
