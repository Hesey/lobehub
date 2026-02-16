import { type LobeChatDatabase } from '@lobechat/database';
import { type EvalRunAgentSnapshot } from '@lobechat/types';

import {
  AgentEvalDatasetModel,
  AgentEvalRunModel,
  AgentEvalRunTopicModel,
} from '@/database/models/agentEval';
import { AgentService } from '@/server/services/agent';

export class AgentEvalRunService {
  private readonly runModel: AgentEvalRunModel;
  private readonly datasetModel: AgentEvalDatasetModel;
  private readonly runTopicModel: AgentEvalRunTopicModel;
  private readonly agentService: AgentService;

  constructor(db: LobeChatDatabase, userId: string) {
    this.runModel = new AgentEvalRunModel(db, userId);
    this.datasetModel = new AgentEvalDatasetModel(db, userId);
    this.runTopicModel = new AgentEvalRunTopicModel(db, userId);
    this.agentService = new AgentService(db, userId);
  }

  async createRun(params: {
    config?: {
      concurrency?: number;
      timeout?: number;
    };
    datasetId: string;
    name?: string;
    targetAgentId?: string;
  }) {
    const agentSnapshot = params.targetAgentId
      ? await this.snapshotAgentConfig(params.targetAgentId)
      : undefined;

    const config = { ...params.config, agentSnapshot };

    return this.runModel.create({ ...params, config });
  }

  async getRunDetails(id: string) {
    const run = await this.runModel.findById(id);
    if (!run) return null;

    // Get dataset and run topics in parallel
    const [dataset, runTopics] = await Promise.all([
      this.datasetModel.findById(run.datasetId),
      this.runTopicModel.findByRunId(id),
    ]);

    // Get target agent display info via AgentService (fallback for runs without snapshot)
    let targetAgent:
      | { avatar?: string; id: string; model?: string; provider?: string; title?: string }
      | undefined;
    if (run.targetAgentId) {
      const agentConfig = await this.agentService.getAgentConfigById(run.targetAgentId);
      if (agentConfig) {
        targetAgent = {
          avatar: agentConfig.avatar,
          id: run.targetAgentId,
          model: agentConfig.model,
          provider: agentConfig.provider,
          title: agentConfig.title,
        };
      }
    }

    return {
      ...run,
      dataset,
      targetAgent,
      topics: runTopics.map((rt) => ({
        evalResult: rt.evalResult,
        passed: rt.passed,
        score: rt.score,
        testCase: rt.testCase,
        topic: rt.topic,
      })),
    };
  }

  async getAgentDisplayInfo(agentId: string) {
    const agentConfig = await this.agentService.getAgentConfigById(agentId);
    if (!agentConfig) return undefined;
    return {
      avatar: agentConfig.avatar,
      id: agentId,
      model: agentConfig.model,
      provider: agentConfig.provider,
      title: agentConfig.title,
    };
  }

  private async snapshotAgentConfig(agentId: string): Promise<EvalRunAgentSnapshot | undefined> {
    const agentConfig = await this.agentService.getAgentConfigById(agentId);
    if (!agentConfig) return undefined;

    return {
      avatar: agentConfig.avatar,
      chatConfig: agentConfig.chatConfig as unknown as Record<string, unknown>,
      description: null,
      fewShots: agentConfig.fewShots,
      model: agentConfig.model,
      params: agentConfig.params as Record<string, unknown>,
      plugins: agentConfig.plugins,
      provider: agentConfig.provider,
      systemRole: agentConfig.systemRole,
      title: agentConfig.title,
    };
  }
}
