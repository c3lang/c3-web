import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import starlight from "@astrojs/starlight"
import fs from "node:fs"

// https://astro.build/config
export default defineConfig({
  site: "https://c3-lang.org",
  redirects: {
    '/guide': '/introduction',
    'guide/basic-types-and-values/': '/language-fundamentals/basic-types-and-values',
    '/guide/my-first-hello-world': '/getting-started/hello-world',
    '/guide/my-first-project': '/getting-started/projects',
    '/references/development': '/get-involved',
    '/references': '/introduction/design-goals',
    '/references/docs/examples': '/language-overview/examples',
    '/references/getting-started/prebuilt-binaries': '/install-c3/prebuilt-binaries',
    '/references/getting-started/setup': '/install-c3/compile',
    '/references/getting-started/primer': '/language-overview/primer',
    '/references/getting-started/allfeatures': '/faq/allfeatures',
    '/references/docs/compare': '/faq/compare-languages'
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
