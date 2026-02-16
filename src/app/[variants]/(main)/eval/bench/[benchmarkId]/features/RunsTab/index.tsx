'use client';

import { Button, Flexbox } from '@lobehub/ui';
import { Select } from 'antd';
import { Plus } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useEvalStore } from '@/store/eval';

import RunCreateModal from '../RunCreateModal';
import EmptyState from './EmptyState';
import RunCard from './RunCard';

interface RunsTabProps {
  benchmarkId: string;
}

const RunsTab = memo<RunsTabProps>(({ benchmarkId }) => {
  const { t } = useTranslation('eval');
  const [createRunOpen, setCreateRunOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const useFetchRuns = useEvalStore((s) => s.useFetchRuns);
  const runList = useEvalStore((s) => s.runList);
  const refreshRuns = useEvalStore((s) => s.refreshRuns);
  useFetchRuns(undefined);

  const sortedRuns = useMemo(
    () =>
      [...runList].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [runList],
  );

  const filteredRuns = useMemo(() => {
    if (statusFilter === 'all') return sortedRuns;
    if (statusFilter === 'active') {
      return sortedRuns.filter((r: any) => r.status === 'running' || r.status === 'pending');
    }
    return sortedRuns.filter((r: any) => r.status === statusFilter);
  }, [sortedRuns, statusFilter]);

  const statusOptions = [
    { label: t('table.filter.all'), value: 'all' },
    { label: t('run.status.completed'), value: 'completed' },
    { label: t('run.filter.active'), value: 'active' },
    { label: t('run.status.idle'), value: 'idle' },
    { label: t('run.status.failed'), value: 'failed' },
    { label: t('run.status.aborted'), value: 'aborted' },
  ];

  return (
    <>
      <Flexbox gap={16}>
        {sortedRuns.length > 0 && (
          <Flexbox horizontal align="center" justify="space-between">
            <Flexbox horizontal align="center" gap={8}>
              <p style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 14, margin: 0 }}>
                {t('benchmark.detail.runCount', { count: filteredRuns.length })}
              </p>
              <Select
                options={statusOptions}
                size="small"
                style={{ width: 128 }}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </Flexbox>
            <Button icon={Plus} size="small" type="primary" onClick={() => setCreateRunOpen(true)}>
              {t('run.actions.create')}
            </Button>
          </Flexbox>
        )}

        {sortedRuns.length === 0 ? (
          <EmptyState onCreate={() => setCreateRunOpen(true)} />
        ) : filteredRuns.length === 0 ? (
          <p style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 14, textAlign: 'center' }}>
            {t('run.filter.empty')}
          </p>
        ) : (
          <Flexbox gap={12}>
            {filteredRuns.map((run: any) => (
              <RunCard benchmarkId={benchmarkId} key={run.id} run={run} onRefresh={refreshRuns} />
            ))}
          </Flexbox>
        )}
      </Flexbox>

      <RunCreateModal
        benchmarkId={benchmarkId}
        open={createRunOpen}
        onClose={() => setCreateRunOpen(false)}
      />
    </>
  );
});

export default RunsTab;
