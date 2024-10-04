declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"Build Your Project/build-commands.mdx": {
	id: "Build Your Project/build-commands.mdx";
  slug: "build-your-project/build-commands";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"Build Your Project/project-config.md": {
	id: "Build Your Project/project-config.md";
  slug: "build-your-project/project-config";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"FAQ/allfeatures.md": {
	id: "FAQ/allfeatures.md";
  slug: "faq/allfeatures";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"FAQ/changesfromc.md": {
	id: "FAQ/changesfromc.md";
  slug: "faq/changesfromc";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"FAQ/compare-languages.md": {
	id: "FAQ/compare-languages.md";
  slug: "faq/compare-languages";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"FAQ/index.mdx": {
	id: "FAQ/index.mdx";
  slug: "faq";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"FAQ/rejected-ideas.md": {
	id: "FAQ/rejected-ideas.md";
  slug: "faq/rejected-ideas";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Generic Programming/anyinterfaces.md": {
	id: "Generic Programming/anyinterfaces.md";
  slug: "generic-programming/anyinterfaces";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Generic Programming/compiletime.md": {
	id: "Generic Programming/compiletime.md";
  slug: "generic-programming/compiletime";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Generic Programming/generics.md": {
	id: "Generic Programming/generics.md";
  slug: "generic-programming/generics";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Generic Programming/macros.md": {
	id: "Generic Programming/macros.md";
  slug: "generic-programming/macros";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Generic Programming/operator-overloading.md": {
	id: "Generic Programming/operator-overloading.md";
  slug: "generic-programming/operator-overloading";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Generic Programming/reflection.md": {
	id: "Generic Programming/reflection.md";
  slug: "generic-programming/reflection";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Get Involved/index.md": {
	id: "Get Involved/index.md";
  slug: "get-involved";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Getting Started/hello-world.md": {
	id: "Getting Started/hello-world.md";
  slug: "getting-started/hello-world";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Getting Started/projects.mdx": {
	id: "Getting Started/projects.mdx";
  slug: "getting-started/projects";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"Implementation Details/grammar.md": {
	id: "Implementation Details/grammar.md";
  slug: "implementation-details/grammar";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Implementation Details/specification.md": {
	id: "Implementation Details/specification.md";
  slug: "implementation-details/specification";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Install C3/compile.md": {
	id: "Install C3/compile.md";
  slug: "install-c3/compile";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Install C3/prebuilt-binaries.md": {
	id: "Install C3/prebuilt-binaries.md";
  slug: "install-c3/prebuilt-binaries";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Introduction/design-goals.md": {
	id: "Introduction/design-goals.md";
  slug: "introduction/design-goals";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Introduction/index.mdx": {
	id: "Introduction/index.mdx";
  slug: "introduction";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"Introduction/roadmap.md": {
	id: "Introduction/roadmap.md";
  slug: "introduction/roadmap";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/arrays.md": {
	id: "Language Common/arrays.md";
  slug: "language-common/arrays";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/attributes.md": {
	id: "Language Common/attributes.md";
  slug: "language-common/attributes";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/cinterop.md": {
	id: "Language Common/cinterop.md";
  slug: "language-common/cinterop";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/contracts.md": {
	id: "Language Common/contracts.md";
  slug: "language-common/contracts";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/defer.md": {
	id: "Language Common/defer.md";
  slug: "language-common/defer";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/define.md": {
	id: "Language Common/define.md";
  slug: "language-common/define";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/optionals-advanced.md": {
	id: "Language Common/optionals-advanced.md";
  slug: "language-common/optionals-advanced";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/optionals-essential.md": {
	id: "Language Common/optionals-essential.md";
  slug: "language-common/optionals-essential";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/vectors.md": {
	id: "Language Common/vectors.md";
  slug: "language-common/vectors";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Fundamentals/basic-types-and-values.md": {
	id: "Language Fundamentals/basic-types-and-values.md";
  slug: "language-fundamentals/basic-types-and-values";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Fundamentals/comments.md": {
	id: "Language Fundamentals/comments.md";
  slug: "language-fundamentals/comments";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Fundamentals/expressions.md": {
	id: "Language Fundamentals/expressions.md";
  slug: "language-fundamentals/expressions";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Fundamentals/functions.md": {
	id: "Language Fundamentals/functions.md";
  slug: "language-fundamentals/functions";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Fundamentals/modules.md": {
	id: "Language Fundamentals/modules.md";
  slug: "language-fundamentals/modules";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Fundamentals/naming.md": {
	id: "Language Fundamentals/naming.md";
  slug: "language-fundamentals/naming";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Fundamentals/statements.md": {
	id: "Language Fundamentals/statements.md";
  slug: "language-fundamentals/statements";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Fundamentals/variables.md": {
	id: "Language Fundamentals/variables.md";
  slug: "language-fundamentals/variables";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Overview/examples.md": {
	id: "Language Overview/examples.md";
  slug: "language-overview/examples";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Overview/primer.md": {
	id: "Language Overview/primer.md";
  slug: "language-overview/primer";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Overview/types.md": {
	id: "Language Overview/types.md";
  slug: "language-overview/types";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Rules/conversion.md": {
	id: "Language Rules/conversion.md";
  slug: "language-rules/conversion";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Rules/precedence.md": {
	id: "Language Rules/precedence.md";
  slug: "language-rules/precedence";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Rules/undefined-behaviour.md": {
	id: "Language Rules/undefined-behaviour.md";
  slug: "language-rules/undefined-behaviour";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Misc Advanced/asm.md": {
	id: "Misc Advanced/asm.md";
  slug: "misc-advanced/asm";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Misc Advanced/builtins.md": {
	id: "Misc Advanced/builtins.md";
  slug: "misc-advanced/builtins";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Misc Advanced/library-packaging.md": {
	id: "Misc Advanced/library-packaging.md";
  slug: "misc-advanced/library-packaging";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Standard Library/index.mdx": {
	id: "Standard Library/index.mdx";
  slug: "standard-library";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"Standard Library/stdlib_refcard.md": {
	id: "Standard Library/stdlib_refcard.md";
  slug: "standard-library/stdlib_refcard";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Thank You/index.mdx": {
	id: "Thank You/index.mdx";
  slug: "thank-you";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
