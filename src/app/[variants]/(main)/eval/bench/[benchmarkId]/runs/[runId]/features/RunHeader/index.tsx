'use client';

import { ActionIcon } from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { App, Button, Popconfirm, Progress, Typography } from 'antd';
import { ArrowLeft, Play, Square, Trash2 } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import StatusBadge from '@/app/[variants]/(main)/eval/features/StatusBadge';
import { useEvalStore } from '@/store/eval';

interface RunHeaderProps {
  benchmarkId: string;
  run: any;
}

const RunHeader = memo<RunHeaderProps>(({ run, benchmarkId }) => {
  const { t } = useTranslation('eval');
  const { modal, message } = App.useApp();
  const navigate = useNavigate();
  const abortRun = useEvalStore((s) => s.abortRun);
  const deleteRun = useEvalStore((s) => s.deleteRun);
  const startRun = useEvalStore((s) => s.startRun);
  const isActive = run.status === 'running' || run.status === 'pending';
  const canStart = run.status === 'idle' || run.status === 'failed' || run.status === 'aborted';
  const [starting, setStarting] = useState(false);

  const handleAbort = async () => {
    await abortRun(run.id);
  };

  const handleDelete = async () => {
    await deleteRun(run.id);
    navigate(`/eval/bench/${benchmarkId}`);
  };

  const handleStart = () => {
    modal.confirm({
      content: t('run.actions.start.confirm'),
      okText: t('run.actions.start'),
      onOk: async () => {
        try {
          setStarting(true);
          await startRun(run.id, run.status !== 'idle');
        } catch (error: any) {
          message.error(error?.message || 'Failed to start run');
        } finally {
          setStarting(false);
        }
      },
      title: t('run.actions.start'),
    });
  };

  return (
    <Flexbox gap={12}>
      <Flexbox align="center" gap={12} horizontal>
        <ActionIcon
          icon={ArrowLeft}
          onClick={() => navigate(`/eval/bench/${benchmarkId}`)}
          size="small"
        />
        <Flexbox flex={1} gap={4}>
          <Flexbox align="center" gap={8} horizontal>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {run.name || run.id.slice(0, 8)}
            </Typography.Title>
            <StatusBadge status={run.status} />
          </Flexbox>
        </Flexbox>
        <Flexbox gap={8} horizontal>
          {canStart && (
            <Button
              icon={<Play size={14} />}
              loading={starting}
              type="primary"
              onClick={handleStart}
            >
              {t('run.actions.start')}
            </Button>
          )}
          {isActive && (
            <Popconfirm onConfirm={handleAbort} title={t('run.actions.abort.confirm')}>
              <ActionIcon icon={Square} size="small" title={t('run.actions.abort')} />
            </Popconfirm>
          )}
          <Popconfirm onConfirm={handleDelete} title={t('run.actions.delete.confirm')}>
            <ActionIcon icon={Trash2} size="small" title={t('run.actions.delete')} />
          </Popconfirm>
        </Flexbox>
      </Flexbox>
      {isActive && run.metrics && (
        <Progress
          percent={
            run.metrics.totalCases
              ? Math.round(
                  ((run.metrics.passedCases + run.metrics.failedCases) / run.metrics.totalCases) *
                    100,
                )
              : 0
          }
          status="active"
        />
      )}
    </Flexbox>
  );
});

export default RunHeader;
