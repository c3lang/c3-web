import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import starlight from '@astrojs/starlight';



// https://astro.build/config
export default defineConfig({
  site: 'https://onrirr.github.io',
  integrations: [tailwind(), starlight({
    title: "The C3 Handbook"
  })]
});