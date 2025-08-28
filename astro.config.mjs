import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import fs from "node:fs"
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig(
  {
    i18n: {
      defaultLocale: "en",
      locales: ["en"],
    },

    site: "https://waveproc.github.io/c3-web",
    base: "/c3-web",

    redirects: {
      '/c3-web/docs': '/getting-started',
      '/c3-web/guide': '/getting-started',
      '/c3-web/introduction': '/getting-started',

      '/c3-web/guide/basic-types-and-values': '/language-fundamentals/basic-types-and-values',

      '/c3-web/guide/my-first-hello-world': '/getting-started/hello-world',
      '/c3-web/guide/my-first-project': '/getting-started/projects',
      '/c3-web/references/development': '/get-involved',

      '/c3-web/references': '/getting-started/design-goals',
      '/c3-web/introduction/design-goals': '/getting-started/design-goals',

      '/c3-web/references/getting-started/prebuilt-binaries': '/getting-started/prebuilt-binaries',
      '/c3-web/install-c3/prebuilt-binaries': '/getting-started/prebuilt-binaries',

      '/c3-web/references/getting-started/setup': '/getting-started/compile',
      '/c3-web/install-c3/compile': '/getting-started/compile',

      '/c3-web/references/docs/examples': '/language-overview/examples',
      '/c3-web/references/getting-started/primer': '/language-overview/primer',


      '/c3-web/references/getting-started/allfeatures': '/faq/allfeatures',
      '/c3-web/introduction/roadmap': '/getting-started/roadmap',
      '/c3-web/compare': '/faq/compare-languages',
      '/c3-web/references/docs/compare': '/faq/compare-languages'

    },

    integrations: [
      starlight(
        {
          favicon: "/ico.svg",
          title: "C3",
          customCss: ["./src/content/docs.css"],
          expressiveCode: {
            shiki: {
              langs: [JSON.parse(fs.readFileSync("./c3-grammar.json", "utf-8"))],
              themes: {
                light: 'github-light',
                dark: 'github-dark',
              },
            },
          },
        }),
    ],

    vite: {
      plugins: [tailwindcss()]
    }
  })
