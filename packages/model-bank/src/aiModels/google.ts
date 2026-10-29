import { type ModelParamsSchema } from '../standard-parameters';
import { type AIChatModelCard, type AIImageModelCard } from '../types';

/**
 * gemini implicit caching not extra cost
 * https://openrouter.ai/docs/features/prompt-caching#implicit-caching
 */

// Gemini metadata synced from lobehub/lobehub main @ 49204982cab98bfa2f2fb6831a34d5018a2af6be.
// Keep older local models and the v1 module layout for compatibility.
const googleChatModels: AIChatModelCard[] = [
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description: 'Points to gemini-3.1-pro-preview',
    displayName: 'Gemini Pro Latest',
    family: 'gemini',
    id: 'gemini-pro-latest',
    knowledgeCutoff: '2025-01',
    maxOutput: 65_536,
    pricing: {
      units: [
        {
          name: 'textInput_cacheRead',
          strategy: 'tiered',
          tiers: [
            { rate: 0.31, upTo: 200_000 },
            { rate: 0.625, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textInput',
          strategy: 'tiered',
          tiers: [
            { rate: 1.25, upTo: 200_000 },
            { rate: 2.5, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textOutput',
          strategy: 'tiered',
          tiers: [
            { rate: 10, upTo: 200_000 },
            { rate: 15, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
      ],
    },
    settings: {
      extendParams: ['thinkingLevel3', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description: 'Points to gemini-3.8-flash',
    displayName: 'Gemini Flash Latest',
    family: 'gemini',
    id: 'gemini-flash-latest',
    knowledgeCutoff: '2026-03',
    maxOutput: 65_536,
    // Introductory pricing, in effect through 2026-12-31. From 2027-01-01 standard rates apply:
    // input 1.5 / output 7.5 / cacheRead 0.15 / cacheWrite lookup { '1h': 1 } (per million tokens).
    // See https://ai.google.dev/gemini-api/docs/pricing
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3.75, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 0.5 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    settings: {
      disabledParams: ['temperature', 'top_p'],
      extendParams: ['thinkingLevel3', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description: 'Points to gemini-3.5-flash-lite',
    displayName: 'Gemini Flash-Lite Latest',
    family: 'gemini',
    id: 'gemini-flash-lite-latest',
    knowledgeCutoff: '2026-03',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.03, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 1 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    settings: {
      disabledParams: ['temperature', 'top_p'],
      extendParams: ['thinkingLevel', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      "Gemini 3.8 Flash is Google's most intelligent Flash model, engineered for long-horizon software engineering, autonomous agents, and complex enterprise workflows.",
    displayName: 'Gemini 3.8 Flash',
    enabled: true,
    family: 'gemini',
    generation: 'gemini-3.8',
    id: 'gemini-3.8-flash',
    knowledgeCutoff: '2026-03',
    maxOutput: 65_536,
    /** Introductory rates through 2026-12-31; standard token rates double afterward.
     * @see https://ai.google.dev/gemini-api/docs/pricing
     */
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3.75, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 0.5 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2026-09-02',
    settings: {
      disabledParams: ['temperature', 'top_p'],
      extendParams: ['thinkingLevel3', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 3.7 Flash is the next iteration in the Gemini 3 series of highly-capable, natively multimodal, reasoning models, with support for computer use and file search.',
    displayName: 'Gemini 3.7 Flash',
    family: 'gemini',
    generation: 'gemini-3.7',
    id: 'gemini-3.7-flash',
    knowledgeCutoff: '2026-03',
    maxOutput: 65_536,
    // Introductory pricing, in effect through 2026-12-31. From 2027-01-01 standard rates apply:
    // input 1.5 / output 7.5 / cacheRead 0.15 / cacheWrite lookup { '1h': 1 } (per million tokens).
    // See https://ai.google.dev/gemini-api/docs/pricing
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3.75, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 0.5 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2026-08-13',
    settings: {
      disabledParams: ['temperature', 'top_p'],
      extendParams: ['thinkingLevel3', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 3.6 Flash balances speed with intelligence for agentic and multimodal tasks, with lower output cost than 3.5 Flash.',
    displayName: 'Gemini 3.6 Flash',
    family: 'gemini',
    generation: 'gemini-3.6',
    id: 'gemini-3.6-flash',
    knowledgeCutoff: '2026-03',
    maxOutput: 65_536,
    // Introductory pricing, in effect through 2026-12-31. From 2027-01-01 standard rates apply:
    // input 1.5 / output 7.5 / cacheRead 0.15 / cacheWrite lookup { '1h': 1 } (per million tokens).
    // See https://ai.google.dev/gemini-api/docs/pricing
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 0.75, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3.75, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 0.5 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2026-07-21',
    settings: {
      disabledParams: ['temperature', 'top_p'],
      extendParams: ['thinkingLevel', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      "Gemini's most intelligent model built for speed, combining frontier intelligence with superior search and grounding.",
    displayName: 'Gemini 3.5 Flash',
    family: 'gemini',
    generation: 'gemini-3.5',
    id: 'gemini-3.5-flash',
    knowledgeCutoff: '2025-01',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.15, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 9, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 1 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2026-05-19',
    settings: {
      extendParams: ['thinkingLevel', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      "Gemini 3.5 Flash-Lite is Google's fastest, most cost-efficient 3.5 model for high-throughput agentic tasks, document parsing, and simple data extraction.",
    displayName: 'Gemini 3.5 Flash-Lite',
    enabled: true,
    family: 'gemini',
    generation: 'gemini-3.5',
    id: 'gemini-3.5-flash-lite',
    knowledgeCutoff: '2026-03',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.03, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 1 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2026-07-21',
    settings: {
      disabledParams: ['temperature', 'top_p'],
      extendParams: ['thinkingLevel', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      imageOutput: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 131_072 + 32_768,
    description:
      "Gemini 3.1 Flash Image (Nano Banana 2) is Google's fastest native image generation model with thinking support, conversational image generation and editing.",
    displayName: 'Nano Banana 2',
    enabled: true,
    family: 'gemini',
    generation: 'gemini-3.1',
    id: 'gemini-3.1-flash-image',
    knowledgeCutoff: '2025-01',
    maxOutput: 32_768,
    pricing: {
      approximatePricePerImage: 0.067,
      units: [
        { name: 'imageOutput', rate: 60, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2026-05-28',
    settings: {
      extendParams: ['imageAspectRatio2', 'imageResolution2', 'thinkingLevel4'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      imageOutput: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 131_072 + 32_768,
    description:
      "Gemini 3.1 Flash Image (Nano Banana 2) is Google's fastest native image generation model with thinking support, conversational image generation and editing.",
    displayName: 'Nano Banana 2',
    family: 'gemini',
    generation: 'gemini-3.1',
    id: 'gemini-3.1-flash-image-preview',
    knowledgeCutoff: '2025-01',
    maxOutput: 32_768,
    pricing: {
      approximatePricePerImage: 0.067,
      units: [
        { name: 'imageOutput', rate: 60, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2026-02-26',
    settings: {
      extendParams: ['imageAspectRatio2', 'imageResolution2', 'thinkingLevel4'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      // no functionCall: the runtime always requests ['Text', 'Image'] modalities for
      // nano-banana models, and Vertex AI rejects function declarations in that mode
      imageOutput: true,
      reasoning: true,
      vision: true,
    },
    contextWindowTokens: 65_536 + 4096,
    description:
      "Gemini 3.1 Flash Lite Image (Nano Banana 2 Lite) is Google's fastest and most cost-efficient image generation model, built for high-volume generation and editing.",
    displayName: 'Nano Banana 2 Lite',
    enabled: true,
    family: 'gemini',
    generation: 'gemini-3.1',
    id: 'gemini-3.1-flash-lite-image',
    knowledgeCutoff: '2025-01',
    maxOutput: 4096,
    pricing: {
      approximatePricePerImage: 0.034,
      units: [
        { name: 'imageOutput', rate: 30, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2026-06-30',
    settings: {
      // no imageResolution2: output resolution is fixed at 1K for the Lite model
      extendParams: ['imageAspectRatio2'],
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 3.1 Pro Preview improves on Gemini 3 Pro with enhanced reasoning capabilities and adds medium thinking level support.',
    displayName: 'Gemini 3.1 Pro Preview',
    enabled: true,
    family: 'gemini',
    generation: 'gemini-3.1',
    id: 'gemini-3.1-pro-preview',
    knowledgeCutoff: '2025-01',
    maxOutput: 65_536,
    pricing: {
      units: [
        {
          name: 'textInput_cacheRead',
          strategy: 'tiered',
          tiers: [
            { rate: 0.2, upTo: 200_000 },
            { rate: 0.4, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textInput',
          strategy: 'tiered',
          tiers: [
            { rate: 2, upTo: 200_000 },
            { rate: 4, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'imageInput',
          strategy: 'tiered',
          tiers: [
            { rate: 2, upTo: 200_000 },
            { rate: 4, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'videoInput',
          strategy: 'tiered',
          tiers: [
            { rate: 2, upTo: 200_000 },
            { rate: 4, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'audioInput',
          strategy: 'tiered',
          tiers: [
            { rate: 2, upTo: 200_000 },
            { rate: 4, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textOutput',
          strategy: 'tiered',
          tiers: [
            { rate: 12, upTo: 200_000 },
            { rate: 18, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          lookup: { prices: { '1h': 4.5 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2026-02-19',
    settings: {
      extendParams: ['thinkingLevel3', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      "Gemini 3.1 Flash-Lite is Google's most cost-efficient multimodal model, optimized for high-volume agentic tasks, translation, and data processing.",
    displayName: 'Gemini 3.1 Flash-Lite',
    family: 'gemini',
    generation: 'gemini-3.1',
    id: 'gemini-3.1-flash-lite',
    knowledgeCutoff: '2025-01',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.025, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput_cacheRead', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput_cacheWrite', rate: 1, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2026-05-07',
    settings: {
      extendParams: ['thinkingLevel', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      structuredOutput: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      "Gemini 3.1 Flash-Lite Preview is Google's most cost-efficient multimodal model, optimized for high-volume agentic tasks, translation, and data processing.",
    displayName: 'Gemini 3.1 Flash-Lite Preview',
    family: 'gemini',
    generation: 'gemini-3.1',
    id: 'gemini-3.1-flash-lite-preview',
    knowledgeCutoff: '2025-01',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.025, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2026-03-04',
    settings: {
      extendParams: ['thinkingLevel', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 3 Flash is the smartest model built for speed, combining cutting-edge intelligence with excellent search grounding.',
    displayName: 'Gemini 3 Flash Preview',
    family: 'gemini',
    generation: 'gemini-3',
    id: 'gemini-3-flash-preview',
    knowledgeCutoff: '2025-01',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.05, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput_cacheRead', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 1 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-12-17',
    settings: {
      extendParams: ['thinkingLevel', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      imageOutput: true,
      reasoning: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 131_072 + 32_768,
    description:
      'Gemini 3 Pro Image (Nano Banana Pro) is Google’s image generation model and also supports multimodal chat.',
    displayName: 'Nano Banana Pro',
    family: 'gemini',
    generation: 'gemini-3',
    id: 'gemini-3-pro-image-preview',
    knowledgeCutoff: '2025-01',
    maxOutput: 32_768,
    pricing: {
      approximatePricePerImage: 0.134,
      units: [
        { name: 'imageOutput', rate: 120, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 12, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-11-20',
    settings: {
      extendParams: ['imageAspectRatio', 'imageResolution'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 2.5 Pro is Google’s most advanced reasoning model, able to reason over code, math, and STEM problems and analyze large datasets, codebases, and documents with long context.',
    displayName: 'Gemini 2.5 Pro',
    family: 'gemini',
    generation: 'gemini-2.5',
    id: 'gemini-2.5-pro',
    knowledgeCutoff: '2025-01',
    maxOutput: 65_536,
    pricing: {
      units: [
        {
          name: 'textInput_cacheRead',
          strategy: 'tiered',
          tiers: [
            { rate: 0.125, upTo: 200_000 },
            { rate: 0.25, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textInput',
          strategy: 'tiered',
          tiers: [
            { rate: 1.25, upTo: 200_000 },
            { rate: 2.5, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'imageInput',
          strategy: 'tiered',
          tiers: [
            { rate: 1.25, upTo: 200_000 },
            { rate: 2.5, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'videoInput',
          strategy: 'tiered',
          tiers: [
            { rate: 1.25, upTo: 200_000 },
            { rate: 2.5, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'audioInput',
          strategy: 'tiered',
          tiers: [
            { rate: 1.25, upTo: 200_000 },
            { rate: 2.5, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textOutput',
          strategy: 'tiered',
          tiers: [
            { rate: 10, upTo: 200_000 },
            { rate: 15, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          lookup: { prices: { '1h': 4.5 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-06-17',
    settings: {
      extendParams: ['thinkingBudget', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description: 'Gemini 2.5 Flash is Google’s best-value model with full capabilities.',
    displayName: 'Gemini 2.5 Flash',
    family: 'gemini',
    generation: 'gemini-2.5',
    id: 'gemini-2.5-flash',
    knowledgeCutoff: '2025-01',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.03, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput_cacheRead', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'videoInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput', rate: 1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 1 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-06-17',
    settings: {
      extendParams: ['thinkingBudget', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      imageOutput: true,
      vision: true,
    },
    contextWindowTokens: 65_536 + 32_768,
    description:
      'Nano Banana is Google’s newest, fastest, and most efficient native multimodal model, enabling conversational image generation and editing.',
    displayName: 'Nano Banana',
    family: 'gemini',
    generation: 'gemini-2.5',
    id: 'gemini-2.5-flash-image',
    knowledgeCutoff: '2025-06',
    maxOutput: 32_768,
    pricing: {
      approximatePricePerImage: 0.039,
      units: [
        { name: 'textInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageOutput', rate: 30, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-08-26',
    settings: {
      extendParams: ['imageAspectRatio'],
    },
    type: 'chat',
  },
  {
    abilities: {
      audio: true,
      functionCall: true,
      reasoning: true,
      search: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 2.5 Flash-Lite is Google’s smallest, best-value model, designed for large-scale use.',
    displayName: 'Gemini 2.5 Flash-Lite',
    family: 'gemini',
    generation: 'gemini-2.5',
    id: 'gemini-2.5-flash-lite',
    knowledgeCutoff: '2025-01',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.01, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'audioInput_cacheRead', rate: 0.03, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
        {
          lookup: { prices: { '1h': 1 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-07-22',
    settings: {
      extendParams: ['thinkingBudget', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 3 Pro is Google’s most powerful agent and vibe-coding model, delivering richer visuals and deeper interaction on top of state-of-the-art reasoning.',
    displayName: 'Gemini 3 Pro Preview',
    id: 'gemini-3-pro-preview',
    maxOutput: 65_536,
    pricing: {
      units: [
        {
          name: 'textInput_cacheRead',
          strategy: 'tiered',
          tiers: [
            { rate: 0.2, upTo: 200_000 },
            { rate: 0.4, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textInput',
          strategy: 'tiered',
          tiers: [
            { rate: 2, upTo: 200_000 },
            { rate: 4, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textOutput',
          strategy: 'tiered',
          tiers: [
            { rate: 12, upTo: 200_000 },
            { rate: 18, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          lookup: { prices: { '1h': 4.5 }, pricingParams: ['ttl'] },
          name: 'textInput_cacheWrite',
          strategy: 'lookup',
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-11-18',
    settings: {
      extendParams: ['thinkingLevel2', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 2.5 Pro Preview is Google’s most advanced reasoning model, able to reason over code, math, and STEM problems and analyze large datasets, codebases, and documents with long context.',
    displayName: 'Gemini 2.5 Pro Preview 06-05',
    id: 'gemini-2.5-pro-preview-06-05',
    maxOutput: 65_536,
    pricing: {
      units: [
        {
          name: 'textInput_cacheRead',
          strategy: 'tiered',
          tiers: [
            { rate: 0.31, upTo: 200_000 },
            { rate: 0.625, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textInput',
          strategy: 'tiered',
          tiers: [
            { rate: 1.25, upTo: 200_000 },
            { rate: 2.5, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textOutput',
          strategy: 'tiered',
          tiers: [
            { rate: 10, upTo: 200_000 },
            { rate: 15, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-06-05',
    settings: {
      extendParams: ['thinkingBudget', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description:
      'Gemini 2.5 Pro Preview is Google’s most advanced reasoning model, able to reason over code, math, and STEM problems and analyze large datasets, codebases, and documents with long context.',
    displayName: 'Gemini 2.5 Pro Preview 05-06',
    id: 'gemini-2.5-pro-preview-05-06',
    maxOutput: 65_536,
    pricing: {
      units: [
        {
          name: 'textInput_cacheRead',
          strategy: 'tiered',
          tiers: [
            { rate: 0.31, upTo: 200_000 },
            { rate: 0.625, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textInput',
          strategy: 'tiered',
          tiers: [
            { rate: 1.25, upTo: 200_000 },
            { rate: 2.5, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
        {
          name: 'textOutput',
          strategy: 'tiered',
          tiers: [
            { rate: 10, upTo: 200_000 },
            { rate: 15, upTo: 'infinity' },
          ],
          unit: 'millionTokens',
        },
      ],
    },
    releasedAt: '2025-05-06',
    settings: {
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      reasoning: true,
      search: true,
      video: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 65_536,
    description: 'Preview release (September 25th, 2025) of Gemini 2.5 Flash-Lite',
    displayName: 'Gemini 2.5 Flash-Lite Preview Sep 2025',
    id: 'gemini-2.5-flash-lite-preview-09-2025',
    maxOutput: 65_536,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.025, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-09-25',
    settings: {
      extendParams: ['thinkingBudget', 'urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 8192,
    description:
      'Gemini 2.0 Flash delivers next-gen features including exceptional speed, native tool use, multimodal generation, and a 1M-token context window.',
    displayName: 'Gemini 2.0 Flash',
    id: 'gemini-2.0-flash',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.025, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-02-05',
    settings: {
      extendParams: ['urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      search: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 8192,
    description:
      'Gemini 2.0 Flash delivers next-gen features including exceptional speed, native tool use, multimodal generation, and a 1M-token context window.',
    displayName: 'Gemini 2.0 Flash 001',
    id: 'gemini-2.0-flash-001',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.025, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.1, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.4, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-02-05',
    settings: {
      extendParams: ['urlContext'],
      searchImpl: 'params',
      searchProvider: 'google',
    },
    type: 'chat',
  },
  {
    abilities: {
      imageOutput: true,
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 8192,
    description: 'Gemini 2.0 Flash experimental model with image generation support.',
    displayName: 'Gemini 2.0 Flash (Image Generation) Experimental',
    id: 'gemini-2.0-flash-exp-image-generation',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-03-14',
    type: 'chat',
  },
  {
    abilities: {
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 8192,
    description: 'A Gemini 2.0 Flash variant optimized for cost efficiency and low latency.',
    displayName: 'Gemini 2.0 Flash-Lite',
    id: 'gemini-2.0-flash-lite',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-02-05',
    type: 'chat',
  },
  {
    abilities: {
      vision: true,
    },
    contextWindowTokens: 1_048_576 + 8192,
    description: 'A Gemini 2.0 Flash variant optimized for cost efficiency and low latency.',
    displayName: 'Gemini 2.0 Flash-Lite 001',
    id: 'gemini-2.0-flash-lite-001',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-02-05',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 1_008_192,
    description:
      'Gemini 1.5 Flash 002 is an efficient multimodal model built for broad deployment.',
    displayName: 'Gemini 1.5 Flash 002',
    id: 'gemini-1.5-flash-002', // Deprecated on 2025-09-24
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.018, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.075, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2024-09-25',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 2_008_192,
    description:
      'Gemini 1.5 Pro 002 is the latest production-ready model with higher-quality output, especially for math, long context, and vision tasks.',
    displayName: 'Gemini 1.5 Pro 002',
    id: 'gemini-1.5-pro-002', // Deprecated on 2025-09-24
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.3125, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 1.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2024-09-24',
    type: 'chat',
  },
  {
    abilities: {
      functionCall: true,
      vision: true,
    },
    contextWindowTokens: 1_008_192,
    description: 'Gemini 1.5 Flash 8B is an efficient multimodal model built for broad deployment.',
    displayName: 'Gemini 1.5 Flash 8B',
    id: 'gemini-1.5-flash-8b-latest',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0.01, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.0375, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0.15, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2024-10-03',
    type: 'chat',
  },
  {
    contextWindowTokens: 32_768 + 8192,
    displayName: 'Gemma 3 1B',
    id: 'gemma-3-1b-it',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 32_768 + 8192,
    displayName: 'Gemma 3 4B',
    id: 'gemma-3-4b-it',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 32_768 + 8192,
    displayName: 'Gemma 3 12B',
    id: 'gemma-3-12b-it',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 131_072 + 8192,
    displayName: 'Gemma 3 27B',
    id: 'gemma-3-27b-it',
    maxOutput: 8192,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 2048 + 8192,
    displayName: 'Gemma 3n E2B',
    id: 'gemma-3n-e2b-it',
    maxOutput: 2048,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
  {
    contextWindowTokens: 2048 + 8192,
    displayName: 'Gemma 3n E4B',
    id: 'gemma-3n-e4b-it',
    maxOutput: 2048,
    pricing: {
      units: [
        { name: 'textInput_cacheRead', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 0, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    type: 'chat',
  },
];

// Common parameters for Imagen models
export const imagenGenParameters: ModelParamsSchema = {
  aspectRatio: {
    default: '1:1',
    enum: ['1:1', '16:9', '9:16', '3:4', '4:3'],
  },
  prompt: { default: '' },
};

const NANO_BANANA_ASPECT_RATIOS = [
  'auto',
  '1:1', // 1024x1024 / 2048x2048 / 4096x4096
  '2:3', // 848x1264 / 1696x2528 / 3392x5056
  '3:2', // 1264x848 / 2528x1696 / 5056x3392
  '3:4', // 896x1200 / 1792x2400 / 3584x4800
  '4:3', // 1200x896 / 2400x1792 / 4800x3584
  '4:5', // 928x1152 / 1856x2304 / 3712x4608
  '5:4', // 1152x928 / 2304x1856 / 4608x3712
  '9:16', // 768x1376 / 1536x2752 / 3072x5504
  '16:9', // 1376x768 / 2752x1536 / 5504x3072
  '21:9', // 1584x672 / 3168x1344 / 6336x2688
];

const NANO_BANANA_2_ASPECT_RATIOS = [...NANO_BANANA_ASPECT_RATIOS, '1:4', '4:1', '1:8', '8:1'];

export const nanoBananaParameters: ModelParamsSchema = {
  aspectRatio: {
    default: 'auto',
    enum: NANO_BANANA_ASPECT_RATIOS,
  },
  imageUrls: {
    default: [],
  },
  prompt: { default: '' },
};

export const nanoBananaProParameters: ModelParamsSchema = {
  aspectRatio: {
    default: 'auto',
    enum: NANO_BANANA_ASPECT_RATIOS,
  },
  imageUrls: {
    default: [],
  },
  prompt: { default: '' },
  resolution: {
    default: '1K',
    enum: ['1K', '2K', '4K'],
  },
};

// Nano Banana 2 Lite has no resolution control (fixed 1K output)
export const nanoBanana2LiteParameters: ModelParamsSchema = {
  aspectRatio: {
    default: 'auto',
    enum: NANO_BANANA_2_ASPECT_RATIOS,
  },
  imageUrls: {
    default: [],
  },
  prompt: { default: '' },
};

export const nanoBanana2Parameters: ModelParamsSchema = {
  aspectRatio: {
    default: 'auto',
    enum: NANO_BANANA_2_ASPECT_RATIOS,
  },
  imageUrls: {
    default: [],
  },
  prompt: { default: '' },
  resolution: {
    default: '1K',
    // Gemini image generation API accepts `"512" | "1K" | "2K" | "4K"`.
    // See https://ai.google.dev/gemini-api/docs/image-generation
    enum: ['512', '1K', '2K', '4K'],
  },
};

const googleImageModels: AIImageModelCard[] = [
  {
    description:
      "Gemini 3.1 Flash Image (Nano Banana 2) is Google's fastest native image generation model with thinking support, conversational image generation and editing.",
    displayName: 'Nano Banana 2',
    enabled: true,
    id: 'gemini-3.1-flash-image:image',
    parameters: nanoBanana2Parameters,
    pricing: {
      approximatePricePerImage: 0.067,
      units: [
        { name: 'imageOutput', rate: 60, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 3, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2026-05-28',
    type: 'image',
  },
  {
    description:
      "Gemini 3.1 Flash Image (Nano Banana 2) is Google's fastest native image generation model with thinking support, conversational image generation and editing.",
    displayName: 'Nano Banana 2',
    id: 'gemini-3.1-flash-image-preview:image',
    parameters: nanoBanana2Parameters,
    pricing: {
      approximatePricePerImage: 0.067,
      units: [
        { name: 'imageOutput', rate: 60, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2026-02-26',
    type: 'image',
  },
  {
    description:
      "Gemini 3.1 Flash Lite Image (Nano Banana 2 Lite) is Google's fastest and most cost-efficient image generation model, built for high-volume generation and editing.",
    displayName: 'Nano Banana 2 Lite',
    enabled: true,
    id: 'gemini-3.1-flash-lite-image:image',
    parameters: nanoBanana2LiteParameters,
    pricing: {
      approximatePricePerImage: 0.034,
      units: [
        { name: 'imageOutput', rate: 30, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageInput', rate: 0.25, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 1.5, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2026-06-30',
    type: 'image',
  },
  {
    description:
      'Gemini 3 Pro Image (Nano Banana Pro) is Google’s image generation model and also supports multimodal chat.',
    displayName: 'Nano Banana Pro',
    enabled: true,
    id: 'gemini-3-pro-image-preview:image',
    parameters: nanoBananaProParameters,
    pricing: {
      approximatePricePerImage: 0.134,
      units: [
        { name: 'imageOutput', rate: 120, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textInput', rate: 2, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 12, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-11-18',
    type: 'image',
  },
  {
    description:
      'Nano Banana is Google’s newest, fastest, and most efficient native multimodal model, enabling conversational image generation and editing.',
    displayName: 'Nano Banana',
    id: 'gemini-2.5-flash-image:image',
    parameters: nanoBananaParameters,
    pricing: {
      approximatePricePerImage: 0.039,
      units: [
        { name: 'textInput', rate: 0.3, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'textOutput', rate: 2.5, strategy: 'fixed', unit: 'millionTokens' },
        { name: 'imageOutput', rate: 30, strategy: 'fixed', unit: 'millionTokens' },
      ],
    },
    releasedAt: '2025-08-26',
    type: 'image',
  },
  {
    description: 'Imagen fourth-generation text-to-image model family.',
    displayName: 'Imagen 4',
    enabled: true,
    id: 'imagen-4.0-generate-001',
    organization: 'Deepmind',
    parameters: imagenGenParameters,
    pricing: {
      units: [{ name: 'imageGeneration', rate: 0.04, strategy: 'fixed', unit: 'image' }],
    },
    releasedAt: '2025-08-15',
    type: 'image',
  },
  {
    description: 'Imagen fourth-generation text-to-image Ultra variant.',
    displayName: 'Imagen 4 Ultra',
    enabled: true,
    id: 'imagen-4.0-ultra-generate-001',
    organization: 'Deepmind',
    parameters: imagenGenParameters,
    pricing: {
      units: [{ name: 'imageGeneration', rate: 0.06, strategy: 'fixed', unit: 'image' }],
    },
    releasedAt: '2025-08-15',
    type: 'image',
  },
  {
    description: 'Imagen fourth-generation text-to-image fast variant.',
    displayName: 'Imagen 4 Fast',
    enabled: true,
    id: 'imagen-4.0-fast-generate-001',
    organization: 'Deepmind',
    parameters: imagenGenParameters,
    pricing: {
      units: [{ name: 'imageGeneration', rate: 0.02, strategy: 'fixed', unit: 'image' }],
    },
    releasedAt: '2025-08-15',
    type: 'image',
  },
];
export const allModels = [...googleChatModels, ...googleImageModels];

export default allModels;
