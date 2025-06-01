import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { titleToLowerCaseKebab } from './components/blog.astro'


import { glob, type Loader, type LoaderContext } from 'astro/loaders';

const docs = defineCollection(
	{ 
		loader: docsLoader(),
		schema: docsSchema() 
	}
)

interface GenerateIdOptions {
	entry: string; 
	base: string; 
	data: Record<string, unknown>;
}

const blogs = defineCollection(
	{ 
		schema: docsSchema(),
		loader: glob({
			generateId: function(options: GenerateIdOptions): string {
				return titleToLowerCaseKebab(options.data?.title)
			},
			base: "./src/content/blogs/",
			pattern: '**/[^_]*.(md|mdx)'
		})
		
		
	}
)

export const collections = {
	docs, blogs
};
