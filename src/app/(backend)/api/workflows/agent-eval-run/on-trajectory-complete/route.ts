import debug from 'debug';
import { NextResponse } from 'next/server';

import { AgentEvalRunModel, AgentEvalRunTopicModel } from '@/database/models/agentEval';
import { getServerDB } from '@/database/server';
import {
  AgentEvalRunWorkflow,
  type OnTrajectoryCompletePayload,
} from '@/server/workflows/agentEvalRun';

const log = debug('lobe-cloud:workflows:on-trajectory-complete');

/**
 * On-trajectory-complete webhook handler
 *
 * Receives a POST from the AgentRuntimeService completion webhook after an
 * agent operation finishes (success or error). Checks whether all test cases
 * for the run are done and, if so, triggers the finalize-run workflow.
 *
 * This is a plain Next.js route handler (NOT an Upstash workflow / serve()).
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OnTrajectoryCompletePayload;
    const { runId, testCaseId, userId, operationId, reason, status } = body;

    if (!runId || !testCaseId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    log(
      'Received: runId=%s testCaseId=%s operationId=%s reason=%s status=%s',
      runId,
      testCaseId,
      operationId,
      reason,
      status,
    );

    const db = await getServerDB();

    // Get run to read totalCases
    const runModel = new AgentEvalRunModel(db, userId);
    const run = await runModel.findById(runId);
    if (!run) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }

    const totalCases = run.metrics?.totalCases;
    if (!totalCases) {
      return NextResponse.json({ message: 'No totalCases metric, skipping completion check' });
    }

    // Count existing RunTopics for this run
    const runTopicModel = new AgentEvalRunTopicModel(db, userId);
    const completedTopics = await runTopicModel.findByRunId(runId);

    log('Completion check: %d/%d', completedTopics.length, totalCases);

    if (completedTopics.length >= totalCases) {
      console.info(
        '[on-trajectory-complete] All %d test cases done for run %s, triggering finalize',
        totalCases,
        runId,
      );
      await AgentEvalRunWorkflow.triggerFinalizeRun({ runId, userId });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[on-trajectory-complete] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 },
    );
  }
}
