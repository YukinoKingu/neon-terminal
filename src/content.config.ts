import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const system = z.literal('cp2020')
const edition = z.literal('2.01')
const publicationStatus = z.enum(['draft', 'review', 'published'])

const commonFields = {
  title: z.string().min(1),
  titleEn: z.string().min(1),
  summary: z.string().min(1).max(240),
  system,
  edition,
  source: z.literal('core-rulebook'),
  status: publicationStatus.default('draft'),
  aliases: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  order: z.number().int().nonnegative().default(100),
}

function contentLoader(directory: string) {
  return glob({
    base: `./src/content/cp2020/${directory}`,
    pattern: '**/[!_]*.{md,mdx}',
  })
}

const cp2020Guides = defineCollection({
  loader: contentLoader('guides'),
  schema: z.object(commonFields),
})

const cp2020Roles = defineCollection({
  loader: contentLoader('roles'),
  schema: z.object({
    ...commonFields,
    specialAbility: z.object({
      title: z.string().min(1),
      titleEn: z.string().min(1),
    }),
    careerSkills: z.array(z.string()).default([]),
  }),
})

const cp2020Stats = defineCollection({
  loader: contentLoader('stats'),
  schema: z.object({
    ...commonFields,
    code: z.string().min(2).max(4),
  }),
})

const cp2020Skills = defineCollection({
  loader: contentLoader('skills'),
  schema: z.object({
    ...commonFields,
    stat: z.string().min(1),
    difficultyMultiplier: z.number().int().positive().default(1),
    isCareerSkillFor: z.array(z.string()).default([]),
  }),
})

const cp2020Lifepath = defineCollection({
  loader: contentLoader('lifepath'),
  schema: z.object({
    ...commonFields,
    die: z.number().int().positive(),
    entries: z.array(z.object({
      range: z.string().min(1),
      result: z.string().min(1),
    })),
  }),
})

const cp2020Rules = defineCollection({
  loader: contentLoader('rules'),
  schema: z.object(commonFields),
})

const cp2020Weapons = defineCollection({
  loader: contentLoader('weapons'),
  schema: z.object({
    ...commonFields,
    category: z.string().min(1),
    concealability: z.string().min(1),
    accuracy: z.number().int(),
    availability: z.string().min(1),
    damage: z.string().min(1),
    shots: z.number().int().nonnegative(),
    rateOfFire: z.number().int().nonnegative(),
    reliability: z.string().min(1),
    rangeMeters: z.number().nonnegative(),
    priceEb: z.number().nonnegative(),
  }),
})

const cp2020Armor = defineCollection({
  loader: contentLoader('armor'),
  schema: z.object({
    ...commonFields,
    category: z.string().min(1),
    stoppingPower: z.number().int().nonnegative(),
    encumbranceValue: z.number().int().nonnegative(),
    locations: z.array(z.string()).min(1),
    priceEb: z.number().nonnegative(),
  }),
})

const cp2020Gear = defineCollection({
  loader: contentLoader('gear'),
  schema: z.object({
    ...commonFields,
    category: z.string().min(1),
    availability: z.string().min(1),
    priceEb: z.number().nonnegative(),
  }),
})

const cp2020Cyberware = defineCollection({
  loader: contentLoader('cyberware'),
  schema: z.object({
    ...commonFields,
    category: z.string().min(1),
    surgery: z.string().min(1),
    humanityLoss: z.string().min(1),
    priceEb: z.number().nonnegative(),
    requirements: z.array(z.string()).default([]),
  }),
})

const cp2020Sources = defineCollection({
  loader: contentLoader('sources'),
  schema: z.object({
    title: z.string().min(1),
    titleEn: z.string().min(1),
    system,
    edition,
    publisher: z.string().min(1),
    identifier: z.string().min(1),
    status: publicationStatus.default('published'),
  }),
})

export const collections = {
  cp2020Armor,
  cp2020Cyberware,
  cp2020Gear,
  cp2020Guides,
  cp2020Lifepath,
  cp2020Roles,
  cp2020Rules,
  cp2020Skills,
  cp2020Sources,
  cp2020Stats,
  cp2020Weapons,
}
