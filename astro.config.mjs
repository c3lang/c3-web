import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import starlight from "@astrojs/starlight"
import fs from "node:fs"


// Directories to be excluded from the top level docs navigation
// by default the older C3 versions directory
const excluded_dirs = ["Previous Versions"]

function isDirectory(fileName)
{
    return fs.lstatSync(fileName).isDirectory();
};

const docsRootPath = "./src/content/docs"

// Generate the docs config for the directories in "docsRootPath"
// We do this because we can control the doc's path and prevent an extra level of nesting
const top_level_docs_config = fs.readdirSync(docsRootPath).
  filter(
      // filter to only directories
      function(file) {
          const filePath = `${docsRootPath}/${file}`

          return isDirectory(filePath) && !excluded_dirs.includes(file)
      }
  ).
  map(
      // generate the config for each allowed directory
      function(dirItem)
      {

          return {
              label: dirItem,
              // Not not collapse the group by default.
              collapsed: false,

              // Autogenerate a group of links for the directory.
              autogenerate: {
                  directory: dirItem,
                  collapsed: false
              }
          }

      }
)


// https://astro.build/config
export default defineConfig(
    {
        i18n: {
            defaultLocale: "en",
            locales: ["en"],
        },
        site: "https://c3-lang.org",
        redirects: {
            '/guide': '/getting-started',
            '/introduction': '/getting-started',

            '/guide/basic-types-and-values': '/language-fundamentals/basic-types-and-values',

            '/guide/my-first-hello-world': '/getting-started/hello-world',
            '/guide/my-first-project': '/getting-started/projects',
            '/references/development': '/get-involved',

            '/references': '/getting-started/design-goals',
            '/introduction/design-goals': '/getting-started/design-goals',

            '/references/getting-started/prebuilt-binaries': '/getting-started/prebuilt-binaries',
            '/install-c3/prebuilt-binaries': '/getting-started/prebuilt-binaries',

            '/references/getting-started/setup': '/getting-started/compile',
            '/install-c3/compile': '/getting-started/compile',

            '/references/docs/examples': '/language-overview/examples',
            '/references/getting-started/primer': '/language-overview/primer',


            '/references/getting-started/allfeatures': '/faq/allfeatures',
            '/introduction/roadmap' :'/getting-started/roadmap',
            '/compare': '/faq/compare-languages',
            '/references/docs/compare': '/faq/compare-languages'

        },
        integrations: [
            tailwind(
                {
                    applyBaseStyles: false,
                }
            ),
            starlight(
                {
                    favicon: "ico.svg",
                    title: "C3",
                    customCss: ["./src/content/docs.css"],
                    expressiveCode: {
                        shiki: {
                            langs: [JSON.parse(fs.readFileSync("./c3-grammar.json", "utf-8"))],
                        },
                    },
                    // sidebar docs: https://starlight.astro.build/guides/sidebar/
                    sidebar: [
                        ...top_level_docs_config,
                        {
                            label: 'C3 0.6.8',
                            badge: {
                                text: "Deprecated",
                                variant: "note"
                            },
                            // Collapse the group by default.
                            collapsed: true,

                            // Autogenerate a group of links for the directory.
                            // Do not collapse _within_ the group by default
                            autogenerate: {
                                directory: 'Previous Versions/v0_6_8',
                                collapsed: false
                            },
                        },
                    ],
                }
            ),
        ],
    }
)
