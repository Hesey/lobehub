'use client';

import { Empty, Flexbox } from '@lobehub/ui';
import { Card, Typography } from 'antd';
import { BarChartBig } from 'lucide-react';
import { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { runSelectors, useEvalStore } from '@/store/eval';

import CaseResultsTable from './features/CaseResultsTable';
import StatusDonut from './features/Charts/StatusDonut';
import IdleState from './features/IdleState';
import PendingState from './features/PendingState';
import RunHeader from './features/RunHeader';
import RunningState from './features/RunningState';
import StatsCards from './features/StatsCards';

const RunDetail = memo(() => {
  const { t } = useTranslation('eval');
  const { benchmarkId, runId } = useParams<{ benchmarkId: string; runId: string }>();
  const useFetchRunDetail = useEvalStore((s) => s.useFetchRunDetail);
  const useFetchRunResults = useEvalStore((s) => s.useFetchRunResults);
  const runDetail = useEvalStore(runSelectors.runDetail);
  const runResults = useEvalStore(runSelectors.runResults);
  const isActive = useEvalStore(runSelectors.isRunActive);
  const refreshRunDetail = useEvalStore((s) => s.refreshRunDetail);
  const pollingRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useFetchRunDetail(runId!);
  useFetchRunResults(runId!);

  // Polling when run is active
  useEffect(() => {
    if (isActive && runId) {
      pollingRef.current = setInterval(() => {
        refreshRunDetail(runId);
      }, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isActive, runId, refreshRunDetail]);

  if (!runDetail) return null;

  const hasResults = !!runResults?.results?.length;
  const isFinished =
    runDetail.status === 'completed' ||
    runDetail.status === 'failed' ||
    runDetail.status === 'aborted';
  const hasMetrics =
    runDetail.metrics && (runDetail.metrics.passedCases > 0 || runDetail.metrics.failedCases > 0);

  return (
    <Flexbox gap={24} padding={24} style={{ margin: '0 auto', maxWidth: 1200, width: '100%' }}>
      <RunHeader benchmarkId={benchmarkId!} hideStart={!hasResults} run={runDetail} />

      {isFinished && (
        <>
          <StatsCards metrics={runDetail.metrics} />

          {/* Charts */}
          <Card
            styles={{
              body: { padding: 20 },
              header: { minHeight: 'auto', padding: '12px 20px' },
            }}
            title={
              <Typography.Text strong style={{ fontSize: 14 }}>
                {t('run.detail.charts')}
              </Typography.Text>
            }
          >
            {hasMetrics ? (
              <StatusDonut
                failedCases={runDetail.metrics.failedCases}
                passedCases={runDetail.metrics.passedCases}
              />
            ) : (
              <Empty description={t('run.detail.noChartData')} icon={BarChartBig} />
            )}
          </Card>
        </>
      )}

      {/* Case Results */}
      {hasResults ? (
        <Card
          styles={{ body: { padding: 0 }, header: { padding: '12px 20px' } }}
          title={
            <Typography.Text strong style={{ fontSize: 14 }}>
              {t('run.detail.caseResults')}
            </Typography.Text>
          }
        >
          <CaseResultsTable
            benchmarkId={benchmarkId!}
            results={runResults.results}
            runId={runId!}
          />
        </Card>
      ) : (
        <Card styles={{ body: { padding: '40px 20px' } }}>
          {runDetail.status === 'running' ? (
            <RunningState />
          ) : runDetail.status === 'pending' ? (
            <PendingState />
          ) : (
            <IdleState run={runDetail} />
          )}
        </Card>
      )}
    </Flexbox>
  );
});

export default RunDetail;
