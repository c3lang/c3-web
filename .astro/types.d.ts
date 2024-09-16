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
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
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
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
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
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"Build System/commands.md": {
	id: "Build System/commands.md";
  slug: "build-system/commands";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Build System/index.md": {
	id: "Build System/index.md";
  slug: "build-system";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Build System/project.md": {
	id: "Build System/project.md";
  slug: "build-system/project";
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
"FAQ/faq.md": {
	id: "FAQ/faq.md";
  slug: "faq/faq";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
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
"Getting Started/basic-types-and-values.md": {
	id: "Getting Started/basic-types-and-values.md";
  slug: "getting-started/basic-types-and-values";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Getting Started/my-first-hello-world.md": {
	id: "Getting Started/my-first-hello-world.md";
  slug: "getting-started/my-first-hello-world";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Getting Started/my-first-project.md": {
	id: "Getting Started/my-first-project.md";
  slug: "getting-started/my-first-project";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Implementation Details/change-logs.md": {
	id: "Implementation Details/change-logs.md";
  slug: "implementation-details/change-logs";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
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
"Language Common/Optionals/advanced.md": {
	id: "Language Common/Optionals/advanced.md";
  slug: "language-common/optionals/advanced";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/Optionals/essential.md": {
	id: "Language Common/Optionals/essential.md";
  slug: "language-common/optionals/essential";
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
"Language Common/vectors.md": {
	id: "Language Common/vectors.md";
  slug: "language-common/vectors";
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
"Language Fundamentals/conversion.md": {
	id: "Language Fundamentals/conversion.md";
  slug: "language-fundamentals/conversion";
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
"Language Fundamentals/precedence.md": {
	id: "Language Fundamentals/precedence.md";
  slug: "language-fundamentals/precedence";
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
"Language Fundamentals/undefined-behaviour.md": {
	id: "Language Fundamentals/undefined-behaviour.md";
  slug: "language-fundamentals/undefined-behaviour";
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
"Language Overview/allfeatures.md": {
	id: "Language Overview/allfeatures.md";
  slug: "language-overview/allfeatures";
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
"Language Overview/sample.md": {
	id: "Language Overview/sample.md";
  slug: "language-overview/sample";
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
"Standard Library/standard_library.md": {
	id: "Standard Library/standard_library.md";
  slug: "standard-library/standard_library";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Standard Library/stdlib_refcard.md": {
	id: "Standard Library/stdlib_refcard.md";
  slug: "standard-library/stdlib_refcard";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = never;
}
