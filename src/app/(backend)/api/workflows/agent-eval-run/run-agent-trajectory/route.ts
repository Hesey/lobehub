import { serve } from '@upstash/workflow/nextjs';
import debug from 'debug';

import {
  AgentEvalRunModel,
  AgentEvalRunTopicModel,
  AgentEvalTestCaseModel,
} from '@/database/models/agentEval';
import { TopicModel } from '@/database/models/topic';
import { getServerDB } from '@/database/server';
import { appEnv } from '@/envs/app';
import { AiAgentService } from '@/server/services/aiAgent';
import { type RunAgentTrajectoryPayload } from '@/server/workflows/agentEvalRun';

const log = debug('lobe-cloud:workflows:run-agent-trajectory');

/**
 * Run agent trajectory workflow - executes a single agent runtime call
 * 1. Get test case content and run info
 * 2. Create topic for this attempt
 * 3. Create RunTopic association
 * 4. Execute agent asynchronously via completionWebhook
 *    (on-trajectory-complete webhook handles finalize check)
 */
export const { POST } = serve<RunAgentTrajectoryPayload>(
  async (context) => {
    const { runId, testCaseId, attemptNumber, userId } = context.requestPayload ?? {};

    log('Starting: runId=%s testCaseId=%s attempt=%d', runId, testCaseId, attemptNumber);

    if (!runId || !testCaseId || attemptNumber === undefined || !userId) {
      return { error: 'Missing required parameters', success: false };
    }

    const db = await getServerDB();

    // Get run
    const run = await context.run('agent-eval-run:get-run', async () => {
      const runModel = new AgentEvalRunModel(db, userId);
      return runModel.findById(runId);
    });

    if (!run) {
      return { error: 'Run not found', success: false };
    }

    // Get test case
    const testCase = await context.run('agent-eval-run:get-test-case', async () => {
      const testCaseModel = new AgentEvalTestCaseModel(db, userId);
      return testCaseModel.findById(testCaseId);
    });

    if (!testCase) {
      return { error: 'Test case not found', success: false };
    }

    // Create topic for this attempt
    const topic = await context.run('agent-eval-run:create-topic', async () => {
      const topicModel = new TopicModel(db, userId);
      return topicModel.create({
        title: `[Eval #${attemptNumber + 1}] ${testCase.content.input?.slice(0, 50) || 'Test Case'}...`,
        trigger: 'eval',
      });
    });

    // Create RunTopic
    await context.run('agent-eval-run:create-run-topic', async () => {
      const runTopicModel = new AgentEvalRunTopicModel(db, userId);
      return runTopicModel.batchCreate([
        {
          runId,
          testCaseId,
          topicId: topic.id,
        },
      ]);
    });

    // Execute agent asynchronously with completion webhook
    await context.run('agent-eval-run:exec-agent', async () => {
      const aiAgentService = new AiAgentService(db, userId);

      const webhookUrl = new URL(
        '/api/workflows/agent-eval-run/on-trajectory-complete',
        appEnv.APP_URL,
      ).toString();

      const result = await aiAgentService.execAgent({
        agentId: run.targetAgentId ?? undefined,
        appContext: {
          topicId: topic.id,
        },
        autoStart: true,
        completionWebhook: {
          body: { runId, testCaseId, userId },
          url: webhookUrl,
        },
        prompt: testCase.content.input || '',
        userInterventionConfig: { approvalMode: 'headless' },
      });

      return result;
    });

    log('Agent started (async): runId=%s testCaseId=%s topicId=%s', runId, testCaseId, topic.id);

    return {
      attemptNumber,
      success: true,
      testCaseId,
      topicId: topic.id,
    };
  },
  {
    flowControl: {
      key: 'agent-eval-run.run-agent-trajectory',
      parallelism: 10,
      ratePerSecond: 10,
    },
  },
);
