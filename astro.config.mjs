import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import starlight from "@astrojs/starlight"
import fs from "node:fs"

// https://astro.build/config
export default defineConfig({
  site: "https://c3-lang.org",
  redirects: {
    '/guide': '/introduction',
    '/references/': '/introduction/design-goals/',
    '/getting-started/prebuilt-binaries/': '/install-c3/prebuilt-binaries/',
    '/getting-started/setup/': '/install-c3/compile/',
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    starlight({
      favicon: "ico.svg",
      title: "The C3 Guide",
      customCss: ["./src/content/docs.css"],
      expressiveCode: {
        shiki: {
          langs: [JSON.parse(fs.readFileSync("./c3-grammar.json", "utf-8"))],
        },
      },
    }),
  ],
})
