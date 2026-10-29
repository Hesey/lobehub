import { google as googleModels } from 'model-bank';

import { ChatModelCard, ModelProviderCard } from '@/types/llm';

const chatModels: ChatModelCard[] = googleModels.map((model) => {
  const abilities = 'abilities' in model ? model.abilities : undefined;
  const parameters = 'parameters' in model ? model.parameters : undefined;

  return {
    contextWindowTokens: model.contextWindowTokens,
    description: model.description,
    displayName: model.displayName,
    enabled: model.enabled,
    functionCall: abilities?.functionCall,
    id: model.id,
    imageOutput: abilities?.imageOutput ?? model.type === 'image',
    maxOutput: model.maxOutput,
    parameters,
    pricing: model.pricing,
    reasoning: abilities?.reasoning,
    releasedAt: model.releasedAt,
    search: abilities?.search,
    type: model.type,
    video: abilities?.video,
    vision: abilities?.vision,
  };
});

const Google: ModelProviderCard = {
  chatModels,
  checkModel: 'gemini-2.0-flash',
  description:
    'Google 的 Gemini 系列是其最先进、通用的 AI 模型产品线，由 Google DeepMind 打造，覆盖文本、多模态对话、原生图片生成与 Imagen 图像模型。',
  enabled: true,
  id: 'google',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://ai.google.dev/gemini-api/docs/models/gemini',
  name: 'Google',
  proxyUrl: {
    placeholder: 'https://generativelanguage.googleapis.com',
  },
  settings: {
    proxyUrl: {
      placeholder: 'https://generativelanguage.googleapis.com',
    },
    responseAnimation: {
      speed: 50,
      text: 'smooth',
    },
    sdkType: 'google',
    showModelFetcher: true,
  },
  url: 'https://ai.google.dev',
};

export default Google;
