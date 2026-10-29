import type {
  Content,
  FunctionDeclaration,
  Part,
  Tool as GoogleFunctionCallTool,
} from '@google/genai';
import { Type as SchemaType } from '@google/genai';
import { imageUrlToBase64, inferContentTypeFromImageUrl } from '@lobechat/utils';

import type { ChatCompletionTool, OpenAIChatMessage, UserMessageContentPart } from '../../types';
import { safeParseJSON } from '../../utils/safeParseJSON';
import { parseDataUri } from '../../utils/uriParser';

const GOOGLE_SUPPORTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const isImageTypeSupported = (mimeType: string | null): boolean => {
  if (!mimeType) return true;
  return GOOGLE_SUPPORTED_IMAGE_TYPES.has(mimeType.toLowerCase());
};

const resolveGoogleImageMimeType = (imageUrl: string, mimeType: string | null): string | null => {
  const normalizedMimeType = mimeType?.trim() || null;

  if (normalizedMimeType && normalizedMimeType !== 'application/octet-stream') {
    return normalizedMimeType;
  }

  try {
    return inferContentTypeFromImageUrl(imageUrl);
  } catch {
    return normalizedMimeType;
  }
};

/**
 * Magic thoughtSignature to bypass Gemini thought signature validation.
 * Use `skip_thought_signature_validator` instead of `context_engineering_is_the_way_to_go`
 * because Vertex AI only accepts `skip_thought_signature_validator`.
 * @see https://ai.google.dev/gemini-api/docs/thought-signatures
 * @see https://github.com/pydantic/pydantic-ai/issues/3881
 */
export const GEMINI_MAGIC_THOUGHT_SIGNATURE = 'skip_thought_signature_validator';

const resolveThoughtSignature = (signature?: string, useMagicSignature?: boolean) =>
  signature || (useMagicSignature ? GEMINI_MAGIC_THOUGHT_SIGNATURE : undefined);

const withThoughtSignature = <T extends Part>(part: T, thoughtSignature?: string): T => {
  if (!thoughtSignature) return part;

  return {
    ...part,
    thoughtSignature,
  };
};

/**
 * Convert OpenAI content part to Google Part format
 */
export const buildGooglePart = async (
  content: UserMessageContentPart,
  useMagicSignature?: boolean,
): Promise<Part | undefined> => {
  switch (content.type) {
    default: {
      return undefined;
    }

    case 'text': {
      return withThoughtSignature({
        text: content.text,
      }, resolveThoughtSignature(content.signature, useMagicSignature));
    }

    case 'thinking': {
      return withThoughtSignature({
        text: content.thinking,
        thought: true,
      }, resolveThoughtSignature(content.signature, useMagicSignature));
    }

    case 'image_url': {
      const { mimeType, base64, type } = parseDataUri(content.image_url.url);

      if (type === 'base64') {
        if (!base64) {
          throw new TypeError("Image URL doesn't contain base64 data");
        }

        const resolvedMimeType = resolveGoogleImageMimeType(content.image_url.url, mimeType);
        if (!isImageTypeSupported(resolvedMimeType)) return undefined;

        return withThoughtSignature({
          inlineData: { data: base64, mimeType: resolvedMimeType || 'image/png' },
        }, resolveThoughtSignature(content.signature, useMagicSignature));
      }

      if (type === 'url') {
        const { base64, mimeType } = await imageUrlToBase64(content.image_url.url);
        const resolvedMimeType = resolveGoogleImageMimeType(content.image_url.url, mimeType);

        if (!isImageTypeSupported(resolvedMimeType)) return undefined;

        return withThoughtSignature({
          inlineData: {
            data: base64,
            mimeType: resolvedMimeType || mimeType || 'application/octet-stream',
          },
        }, resolveThoughtSignature(content.signature, useMagicSignature));
      }

      throw new TypeError(`currently we don't support image url: ${content.image_url.url}`);
    }

    case 'video_url': {
      const { mimeType, base64, type } = parseDataUri(content.video_url.url);

      if (type === 'base64') {
        if (!base64) {
          throw new TypeError("Video URL doesn't contain base64 data");
        }

        return withThoughtSignature({
          inlineData: { data: base64, mimeType: mimeType || 'video/mp4' },
        }, resolveThoughtSignature(content.signature, useMagicSignature));
      }

      if (type === 'url') {
        // Use imageUrlToBase64 for SSRF protection (works for any binary data including videos)
        // Note: This might need size/duration limits for practical use
        const { base64, mimeType } = await imageUrlToBase64(content.video_url.url);

        return withThoughtSignature({
          inlineData: { data: base64, mimeType },
        }, resolveThoughtSignature(content.signature, useMagicSignature));
      }

      throw new TypeError(`currently we don't support video url: ${content.video_url.url}`);
    }
  }
};

/**
 * Convert OpenAI message to Google Content format
 */
export const buildGoogleMessage = async (
  message: OpenAIChatMessage,
  toolCallNameMap?: Map<string, string>,
): Promise<Content> => {
  const content = message.content as string | UserMessageContentPart[];
  const useMagicSignature = message.role === 'assistant';

  // Handle assistant messages with tool_calls
  if (!!message.tool_calls) {
    return {
      parts: message.tool_calls.map<Part>((tool) =>
        withThoughtSignature(
          {
            functionCall: {
              args: safeParseJSON(tool.function.arguments)!,
              name: tool.function.name,
            },
          },
          tool.thoughtSignature,
        ),
      ),
      role: 'model',
    };
  }

  // Convert tool_call result to functionResponse part
  if (message.role === 'tool' && toolCallNameMap && message.tool_call_id) {
    const functionName = toolCallNameMap.get(message.tool_call_id);
    if (functionName) {
      return {
        parts: [
          {
            functionResponse: {
              name: functionName,
              response: { result: message.content },
            },
          },
        ],
        role: 'user',
      };
    }
  }

  const getParts = async () => {
    if (typeof content === 'string') {
      return [withThoughtSignature({ text: content }, resolveThoughtSignature(undefined, useMagicSignature))];
    }

    const parts = await Promise.all(
      content.map(async (c) => await buildGooglePart(c, useMagicSignature)),
    );
    return parts.filter(Boolean) as Part[];
  };

  return {
    parts: await getParts(),
    role: message.role === 'assistant' ? 'model' : 'user',
  };
};

/**
 * Convert messages from the OpenAI format to Google GenAI SDK format
 */
export const buildGoogleMessages = async (messages: OpenAIChatMessage[]): Promise<Content[]> => {
  const toolCallNameMap = new Map<string, string>();

  // Build tool call id to name mapping
  messages.forEach((message) => {
    if (message.role === 'assistant' && message.tool_calls) {
      message.tool_calls.forEach((toolCall) => {
        if (toolCall.type === 'function') {
          toolCallNameMap.set(toolCall.id, toolCall.function.name);
        }
      });
    }
  });

  const pools = messages
    .filter((message) => message.role !== 'function')
    .map(async (msg) => await buildGoogleMessage(msg, toolCallNameMap));

  const contents = await Promise.all(pools);

  // Filter out empty messages: contents.parts must not be empty.
  const nonEmptyContents = contents.filter(
    (content: Content) => content.parts && content.parts.length > 0,
  );

  // Merge consecutive functionResponse contents into a single Content.
  // Vertex AI requires the number of functionResponse parts to equal
  // the number of functionCall parts in the preceding model turn.
  const filteredContents: Content[] = [];
  for (const content of nonEmptyContents) {
    const isFunctionResponse =
      content.role === 'user' && content.parts?.every((p) => p.functionResponse);

    const last = filteredContents.at(-1);
    const lastIsFunctionResponse =
      last?.role === 'user' && last.parts?.every((p) => p.functionResponse);

    if (isFunctionResponse && lastIsFunctionResponse) {
      last!.parts = [...(last!.parts || []), ...(content.parts || [])];
    } else {
      filteredContents.push(content);
    }
  }

  // Check if the last message is a tool message
  const lastMessage = messages.at(-1);
  const shouldAddMagicSignature = lastMessage?.role === 'tool';

  if (shouldAddMagicSignature) {
    // Find the last user message index in filtered contents
    let lastUserIndex = -1;
    for (let i = filteredContents.length - 1; i >= 0; i--) {
      if (filteredContents[i].role === 'user') {
        // Skip if it's a functionResponse (tool result)
        const hasFunctionResponse = filteredContents[i].parts?.some((p) => p.functionResponse);
        if (!hasFunctionResponse) {
          lastUserIndex = i;
          break;
        }
      }
    }

    // Add magic signature to all function calls after last user message that don't have thoughtSignature
    for (let i = lastUserIndex + 1; i < filteredContents.length; i++) {
      const content = filteredContents[i];
      if (content.role === 'model' && content.parts) {
        for (const part of content.parts) {
          if (part.functionCall && !part.thoughtSignature) {
            // Only add magic signature if thoughtSignature doesn't exist
            part.thoughtSignature = GEMINI_MAGIC_THOUGHT_SIGNATURE;
          }
        }
      }
    }
  }

  return filteredContents;
};

/**
 * JSON Schema keywords that cause Google GenAI / Vertex AI SDK validation errors.
 * Other unsupported keywords are silently ignored by the API, so only strip these.
 */
const UNSUPPORTED_SCHEMA_KEYS = new Set(['examples', 'default']);

/**
 * Sanitize JSON Schema for Google GenAI compatibility
 * Google's API doesn't support certain JSON Schema keywords like 'const'
 * This function recursively processes the schema and converts unsupported keywords
 */
const sanitizeSchemaForGoogle = (schema: Record<string, any>): Record<string, any> => {
  if (!schema || typeof schema !== 'object') return schema;

  // Handle arrays
  if (Array.isArray(schema)) {
    return schema.map((item) => sanitizeSchemaForGoogle(item));
  }

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(schema)) {
    // Strip unsupported JSON Schema keywords (e.g. examples, default, $schema)
    if (UNSUPPORTED_SCHEMA_KEYS.has(key)) continue;

    // Convert 'const' to 'enum' with single value (Google doesn't support 'const')
    if (key === 'const') {
      result['enum'] = [value];
      continue;
    }

    // Filter null values from enum arrays (Google doesn't support null in enum)
    if (key === 'enum' && Array.isArray(value)) {
      const filteredEnum = value.filter((item) => item !== null);
      // Only set enum if there are remaining values after filtering
      if (filteredEnum.length > 0) {
        result[key] = filteredEnum;
      }
      continue;
    }

    // Recursively process nested objects
    if (value && typeof value === 'object') {
      result[key] = sanitizeSchemaForGoogle(value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

/**
 * Convert ChatCompletionTool to Google FunctionDeclaration
 */
export const buildGoogleTool = (tool: ChatCompletionTool): FunctionDeclaration => {
  const functionDeclaration = tool.function;
  const parameters = functionDeclaration.parameters;
  // refs: https://github.com/lobehub/lobe-chat/pull/5002
  const rawProperties =
    parameters?.properties && Object.keys(parameters.properties).length > 0
      ? parameters.properties
      : { dummy: { type: 'string' } }; // dummy property to avoid empty object

  // Sanitize properties to remove unsupported JSON Schema keywords for Google
  const properties = sanitizeSchemaForGoogle(rawProperties);

  return {
    description: functionDeclaration.description,
    name: functionDeclaration.name,
    parameters: {
      description: parameters?.description,
      properties,
      required: parameters?.required,
      type: SchemaType.OBJECT,
    },
  };
};

/**
 * Build Google function declarations from ChatCompletionTool array
 */
export const buildGoogleTools = (
  tools: ChatCompletionTool[] | undefined,
): GoogleFunctionCallTool[] | undefined => {
  if (!tools || tools.length === 0) return;

  // Deduplicate by function name to prevent Vertex AI 400 error:
  // "Duplicate function declaration found: xxx"
  const seenToolNames = new Set<string>();
  const uniqueTools = tools.filter((tool) => {
    const name = tool.function.name;
    if (seenToolNames.has(name)) return false;
    seenToolNames.add(name);
    return true;
  });

  return [
    {
      functionDeclarations: uniqueTools.map((tool) => buildGoogleTool(tool)),
    },
  ];
};
