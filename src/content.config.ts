import {defineCollection} from 'astro:content';
import {z} from 'astro/zod';
import {docsLoader} from '@astrojs/starlight/loaders';
import {docsSchema} from '@astrojs/starlight/schema';

/**
 * Extra front matter understood by CodePrime layouts.
 *
 * Problem pages:   source, tags, complexity, difficulty
 * Blog posts:      date, authors
 * System design:   company, tags, date
 */
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        source: z.url().optional(),
        difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
        tags: z.array(z.string()).default([]),
        complexity: z
          .object({time: z.string().optional(), space: z.string().optional()})
          .optional(),
        date: z.coerce.date().optional(),
        authors: z.array(z.string()).optional(),
        company: z.string().optional(),
      }),
    }),
  }),
};
