import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema'

import { glob, type Loader, type LoaderContext } from 'astro/loaders';

const docs = defineCollection(
	{ 
		loader: docsLoader(),
		schema: docsSchema(
			{
				extend: (context) => blogSchema(context)
			}
		) 
	}
)
const blogs = defineCollection(
	{ 
		schema: docsSchema(
			{
				extend: (context) => blogSchema(context)
			}
		),
		loader: glob({
			// generateId: await async function(options) {
			// 	console.log("options.base ", options.base)
			// 	console.log("options.data ", options.data)
			// 	return options.base + options.data?.title
			// },
			base: "./src/content/blogs/",
			// pattern: '*.md'
			// pattern: '**/*.md'
			pattern: '**/[^_]*.(md|mdx)'
		})
		
		
	}
)

export const collections = {
	docs, blogs
};
