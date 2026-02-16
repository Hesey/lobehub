import { serve } from '@upstash/workflow/nextjs';
import debug from 'debug';

import { AgentEvalRunModel } from '@/database/models/agentEval';
import { getServerDB } from '@/database/server';
import { AgentEvalRunWorkflow, type ExecuteTestCasePayload } from '@/server/workflows/agentEvalRun';

const log = debug('lobe-cloud:workflows:execute-test-case');

/**
 * Execute test case workflow - manages K executions of a single test case
 * 1. Get run config to determine K value
 * 2. Trigger K parallel run-agent-trajectory workflows
 * 3. Each trajectory executes the agent once and stores results
 */
export const { POST } = serve<ExecuteTestCasePayload>(
  async (context) => {
    const { runId, testCaseId, userId } = context.requestPayload ?? {};

    log('Starting: runId=%s testCaseId=%s', runId, testCaseId);

    if (!runId || !testCaseId || !userId) {
      return { error: 'Missing runId, testCaseId, or userId', success: false };
    }

    const db = await getServerDB();

    // Get run to get K value from config
    const run = await context.run('agent-eval-run:get-run', async () => {
      const runModel = new AgentEvalRunModel(db, userId);
      return runModel.findById(runId);
    });

    if (!run) {
      return { error: 'Run not found', success: false };
    }

    // Get K value (default to 1 if not specified)
    const k = run.config?.k ?? 1;

    log('Executing: runId=%s testCaseId=%s k=%d', runId, testCaseId, k);

    // Trigger K parallel run-agent-trajectory workflows
    await Promise.all(
      Array.from({ length: k }).map((_, i) =>
        context.run(`agent-eval-run:trajectory:${testCaseId}:${i}`, () =>
          AgentEvalRunWorkflow.triggerRunAgentTrajectory({
            attemptNumber: i,
            runId,
            testCaseId,
            userId,
          }),
        ),
      ),
    );

    log('Completed: runId=%s testCaseId=%s k=%d', runId, testCaseId, k);

    return {
      k,
      success: true,
      testCaseId,
    };
  },
  {
    flowControl: {
      key: 'agent-eval-run.execute-test-case',
      parallelism: 20,
      ratePerSecond: 5,
    },
  },
);
