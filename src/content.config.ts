import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const system = z.literal('cp2020')
const edition = z.literal('2.01')
const publicationStatus = z.enum(['draft', 'review', 'published'])
const verificationStatus = z.enum(['unverified', 'source-checked', 'reviewed'])
const statCode = z.enum(['ATTR', 'BODY', 'COOL', 'EMP', 'INT', 'LUCK', 'MA', 'REF', 'TECH'])

const commonFields = {
  title: z.string().min(1),
  titleEn: z.string().min(1),
  summary: z.string().min(1).max(240),
  system,
  edition,
  source: z.literal('core-rulebook'),
  sourcePages: z.array(z.object({
    print: z.string(),
    ocr: z.array(z.string()),
  })).optional(),
  status: publicationStatus.default('draft'),
  verification: verificationStatus.default('unverified'),
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
      description: z.string().min(1),
      rank: z.object({
        min: z.number().int().min(1),
        max: z.number().int().max(10),
        progression: z.string().min(1),
        details: z.array(z.object({
          level: z.number().int().min(1).max(10),
          effect: z.string().min(1),
        })).length(10),
      }),
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
    stat: statCode,
    difficultyMultiplier: z.number().int().positive(),
    isCareerSkillFor: z.array(z.string()).optional(),
  }),
})

const cp2020Lifepath = defineCollection({
  loader: contentLoader('lifepath'),
  schema: z.object({
    ...commonFields,
    die: z.number().int().positive().optional(),
    entries: z.array(z.object({
      range: z.string().min(1),
      result: z.string().min(1),
    })).optional(),
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
    concealability: z.string().min(1).optional(),
    accuracy: z.number().int().optional(),
    availability: z.string().min(1).optional(),
    damage: z.string().min(1).optional(),
    shots: z.number().int().nonnegative().optional(),
    rateOfFire: z.number().int().nonnegative().optional(),
    reliability: z.string().min(1).optional(),
    rangeMeters: z.number().nonnegative().optional(),
    priceEb: z.number().nonnegative().optional(),
  }),
})

const cp2020Armor = defineCollection({
  loader: contentLoader('armor'),
  schema: z.object({
    ...commonFields,
    category: z.string().min(1),
    stoppingPower: z.number().int().nonnegative().optional(),
    encumbranceValue: z.number().int().nonnegative().optional(),
    locations: z.array(z.string()).min(1).optional(),
    priceEb: z.number().nonnegative().optional(),
  }),
})

const cp2020Gear = defineCollection({
  loader: contentLoader('gear'),
  schema: z.object({
    ...commonFields,
    category: z.string().min(1),
    availability: z.string().min(1).optional(),
    priceEb: z.number().nonnegative().optional(),
    priceModel: z.string().optional(),
  }),
})

const cp2020Cyberware = defineCollection({
  loader: contentLoader('cyberware'),
  schema: z.object({
    ...commonFields,
    category: z.string().min(1),
    catalogId: z.string().optional(),
    optionSlots: z.number().int().nonnegative().optional(),
    surgery: z.string().min(1).optional(),
    humanityLoss: z.string().min(1).optional(),
    priceEb: z.number().nonnegative().optional(),
    requirements: z.array(z.string()).default([]),
  }),
})

function defineReferenceCollection(directory: string) {
  return defineCollection({
    loader: contentLoader(directory),
    schema: z.object(commonFields),
  })
}

const cp2020Combat = defineReferenceCollection('combat')
const cp2020Health = defineReferenceCollection('health')
const cp2020Drugs = defineReferenceCollection('drugs')
const cp2020Netrunning = defineReferenceCollection('netrunning')
const cp2020World = defineReferenceCollection('world')
const cp2020Gamemastering = defineReferenceCollection('gamemastering')
const cp2020Adventures = defineReferenceCollection('adventures')
const cp2020Corporations = defineReferenceCollection('corporations')
const cp2020NightCity = defineReferenceCollection('night-city')
const cp2020People = defineReferenceCollection('people')
const cp2020Screamsheets = defineReferenceCollection('screamsheets')

const cp2020Sources = defineCollection({
  loader: contentLoader('sources'),
  schema: z.object({
    title: z.string().min(1),
    titleEn: z.string().min(1),
    system,
    edition,
    publisher: z.string().min(1),
    identifier: z.string().min(1),
    language: z.string().min(1),
    sourceFile: z.string().min(1),
    permission: z.discriminatedUnion('status', [
      z.object({
        status: z.literal('granted'),
        grantor: z.string().min(1).optional(),
        grantee: z.string().min(1).optional(),
        receivedAt: z.string().min(1).optional(),
        evidencePath: z.string().min(1),
        evidenceSha256: z.string().min(1),
        scope: z.string().min(1),
        attribution: z.string().min(1),
        restrictions: z.string().min(1),
        expiresAt: z.string().min(1).optional(),
      }),
      z.object({
        status: z.enum(['blocked', 'denied']),
        grantor: z.string().min(1).optional(),
        grantee: z.string().min(1).optional(),
        receivedAt: z.string().min(1).optional(),
        evidencePath: z.string().min(1).optional(),
        evidenceSha256: z.string().min(1).optional(),
        scope: z.string().min(1).optional(),
        attribution: z.string().min(1).optional(),
        restrictions: z.string().min(1).optional(),
        expiresAt: z.string().min(1).optional(),
      }),
    ]),
    status: publicationStatus.default('published'),
    verification: verificationStatus.default('unverified'),
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
  cp2020Adventures,
  cp2020Combat,
  cp2020Corporations,
  cp2020Drugs,
  cp2020Gamemastering,
  cp2020Health,
  cp2020Netrunning,
  cp2020NightCity,
  cp2020People,
  cp2020Screamsheets,
  cp2020World,
}
