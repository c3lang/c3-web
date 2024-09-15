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
		"Generic Programming": {
"anyinterfaces.md": {
	id: "anyinterfaces.md";
  slug: "anyinterfaces";
  body: string;
  collection: "Generic Programming";
  data: any
} & { render(): Render[".md"] };
"compiletime.md": {
	id: "compiletime.md";
  slug: "compiletime";
  body: string;
  collection: "Generic Programming";
  data: any
} & { render(): Render[".md"] };
"generics.md": {
	id: "generics.md";
  slug: "generics";
  body: string;
  collection: "Generic Programming";
  data: any
} & { render(): Render[".md"] };
"macros.md": {
	id: "macros.md";
  slug: "macros";
  body: string;
  collection: "Generic Programming";
  data: any
} & { render(): Render[".md"] };
"reflection.md": {
	id: "reflection.md";
  slug: "reflection";
  body: string;
  collection: "Generic Programming";
  data: any
} & { render(): Render[".md"] };
};
"docs": {
"Advanced/asm.md": {
	id: "Advanced/asm.md";
  slug: "advanced/asm";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Advanced/builtins.md": {
	id: "Advanced/builtins.md";
  slug: "advanced/builtins";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Advanced/libraries.md": {
	id: "Advanced/libraries.md";
  slug: "advanced/libraries";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
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
"Error Handling/optionals.md": {
	id: "Error Handling/optionals.md";
  slug: "error-handling/optionals";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Error Handling/optionals_advanced.md": {
	id: "Error Handling/optionals_advanced.md";
  slug: "error-handling/optionals_advanced";
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
"Get Involved/changes.md": {
	id: "Get Involved/changes.md";
  slug: "get-involved/changes";
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
"Get Involved/rejectedideas.md": {
	id: "Get Involved/rejectedideas.md";
  slug: "get-involved/rejectedideas";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Getting Started/allfeatures.md": {
	id: "Getting Started/allfeatures.md";
  slug: "getting-started/allfeatures";
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
"Getting Started/primer.md": {
	id: "Getting Started/primer.md";
  slug: "getting-started/primer";
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
"Install C3/prebuilt-binaries.md": {
	id: "Install C3/prebuilt-binaries.md";
  slug: "install-c3/prebuilt-binaries";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Install C3/setup.md": {
	id: "Install C3/setup.md";
  slug: "install-c3/setup";
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
"Language Common/comments.md": {
	id: "Language Common/comments.md";
  slug: "language-common/comments";
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
"Language Common/conversion.md": {
	id: "Language Common/conversion.md";
  slug: "language-common/conversion";
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
"Language Common/expressions.md": {
	id: "Language Common/expressions.md";
  slug: "language-common/expressions";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/functions.md": {
	id: "Language Common/functions.md";
  slug: "language-common/functions";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/modules.md": {
	id: "Language Common/modules.md";
  slug: "language-common/modules";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/naming.md": {
	id: "Language Common/naming.md";
  slug: "language-common/naming";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/operators.md": {
	id: "Language Common/operators.md";
  slug: "language-common/operators";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/precedence.md": {
	id: "Language Common/precedence.md";
  slug: "language-common/precedence";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/statements.md": {
	id: "Language Common/statements.md";
  slug: "language-common/statements";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/syntax.md": {
	id: "Language Common/syntax.md";
  slug: "language-common/syntax";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/undefinedbehaviour.md": {
	id: "Language Common/undefinedbehaviour.md";
  slug: "language-common/undefinedbehaviour";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Common/variables.md": {
	id: "Language Common/variables.md";
  slug: "language-common/variables";
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
"Language Comparisons/changesfromc.md": {
	id: "Language Comparisons/changesfromc.md";
  slug: "language-comparisons/changesfromc";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"Language Comparisons/compare.md": {
	id: "Language Comparisons/compare.md";
  slug: "language-comparisons/compare";
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
