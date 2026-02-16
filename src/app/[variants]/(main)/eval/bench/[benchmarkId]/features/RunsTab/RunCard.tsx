import { Flexbox, Icon } from '@lobehub/ui';
import { App, Card, Dropdown, Progress } from 'antd';
import { createStaticStyles } from 'antd-style';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Ellipsis,
  Play,
  Square,
  Trash2,
  XCircle,
} from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useEvalStore } from '@/store/eval';

import StatusBadge from '../../../../features/StatusBadge';

const styles = createStaticStyles(({ css, cssVar }) => ({
  card: css`
    transition: all 0.2s;

    .ant-card-body {
      padding: 20px;
    }

    &:hover {
      border-color: ${cssVar.colorPrimaryBorder};
      background: ${cssVar.colorFillQuaternary};
    }
  `,
  meta: css`
    font-size: 12px;
    color: ${cssVar.colorTextTertiary};
  `,
  name: css`
    overflow: hidden;

    font-size: 14px;
    font-weight: 500;
    color: ${cssVar.colorText};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  score: css`
    font-family: monospace;
    font-size: 14px;
    font-weight: 600;
    color: ${cssVar.colorText};
  `,
  separator: css`
    color: ${cssVar.colorBorder};
  `,
  stat: css`
    display: inline-flex;
    gap: 4px;
    align-items: center;
    font-size: 13px;
  `,
}));

interface RunCardProps {
  benchmarkId: string;
  onRefresh?: () => Promise<void>;
  run: any;
}

const RunCard = memo<RunCardProps>(({ benchmarkId, run, onRefresh }) => {
  const { t } = useTranslation('eval');
  const { modal, message } = App.useApp();
  const deleteRun = useEvalStore((s) => s.deleteRun);
  const startRun = useEvalStore((s) => s.startRun);
  const abortRun = useEvalStore((s) => s.abortRun);

  const progress = run.totalCases > 0 ? (run.completedCases / run.totalCases) * 100 : 0;
  const passRate = run.completedCases > 0 ? (run.passCount / run.completedCases) * 100 : 0;
  const hasStats =
    (run.status === 'completed' || run.status === 'running') && run.completedCases > 0;
  const canStart = run.status === 'idle' || run.status === 'failed' || run.status === 'aborted';
  const isActive = run.status === 'running' || run.status === 'pending';

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.confirm({
      content: t('run.actions.start.confirm'),
      okText: t('run.actions.start'),
      onOk: async () => {
        try {
          await startRun(run.id, run.status !== 'idle');
          await onRefresh?.();
        } catch (error: any) {
          message.error(error?.message || 'Failed to start run');
        }
      },
      title: t('run.actions.start'),
    });
  };

  const handleAbort = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    modal.confirm({
      content: t('run.actions.abort.confirm'),
      okText: t('run.actions.abort'),
      okButtonProps: { danger: true },
      onOk: async () => {
        await abortRun(run.id);
        await onRefresh?.();
      },
      title: t('run.actions.abort'),
    });
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    modal.confirm({
      content: t('run.actions.delete.confirm'),
      okButtonProps: { danger: true },
      okText: t('run.actions.delete'),
      onOk: async () => {
        await deleteRun(run.id);
        await onRefresh?.();
      },
      title: t('run.actions.delete'),
    });
  };

  const menuItems = [
    ...(canStart
      ? [
          {
            icon: <Play size={14} />,
            key: 'start',
            label: t('run.actions.start'),
            onClick: ({ domEvent }: any) => handleStart(domEvent),
          },
        ]
      : []),
    ...(isActive
      ? [
          {
            danger: true,
            icon: <Square size={14} />,
            key: 'abort',
            label: t('run.actions.abort'),
            onClick: ({ domEvent }: any) => handleAbort(domEvent),
          },
        ]
      : []),
    { type: 'divider' as const },
    {
      danger: true,
      icon: <Trash2 size={14} />,
      key: 'delete',
      label: t('run.actions.delete'),
      onClick: ({ domEvent }: any) => handleDelete(domEvent),
    },
  ];

  return (
    <Link style={{ textDecoration: 'none' }} to={`/eval/bench/${benchmarkId}/runs/${run.id}`}>
      <Card className={styles.card}>
        <Flexbox horizontal align="center" gap={16}>
          {/* Left: Info */}
          <Flexbox flex={1} gap={4} style={{ minWidth: 0 }}>
            <Flexbox horizontal align="center" gap={8}>
              <span className={styles.name}>{run.name}</span>
              <StatusBadge status={run.status} />
            </Flexbox>
            <Flexbox horizontal align="center" className={styles.meta} gap={4}>
              {run.model && <span style={{ fontFamily: 'monospace' }}>{run.model}</span>}
              {run.model && run.agentName && <span className={styles.separator}>/</span>}
              {run.agentName && <span>{run.agentName}</span>}
              {run.temperature !== undefined && (
                <>
                  <span className={styles.separator}>/</span>
                  <span>T={run.temperature}</span>
                </>
              )}
              {run.createdAt && (
                <>
                  <span className={styles.separator}>/</span>
                  <span>{formatDate(run.createdAt)}</span>
                </>
              )}
            </Flexbox>
          </Flexbox>

          {/* Center: Progress (visible for running) */}
          {run.status === 'running' && (
            <Flexbox gap={4} style={{ width: 144 }}>
              <Flexbox horizontal align="center" justify="space-between">
                <span className={styles.meta}>
                  {run.completedCases}/{run.totalCases}
                </span>
                <span className={styles.meta}>{progress.toFixed(0)}%</span>
              </Flexbox>
              <Progress percent={progress} showInfo={false} size="small" />
            </Flexbox>
          )}

          {/* Right: Stats */}
          {hasStats && (
            <Flexbox horizontal align="center" gap={12}>
              <span className={styles.stat} style={{ color: 'var(--ant-color-success)' }}>
                <Icon icon={CheckCircle2} size={14} />
                {run.passCount}
              </span>
              <span className={styles.stat} style={{ color: 'var(--ant-color-error)' }}>
                <Icon icon={XCircle} size={14} />
                {run.failCount}
              </span>
              {run.errorCount > 0 && (
                <span className={styles.stat} style={{ color: 'var(--ant-color-warning)' }}>
                  <Icon icon={AlertTriangle} size={14} />
                  {run.errorCount}
                </span>
              )}
              <Flexbox gap={2} style={{ minWidth: 60, textAlign: 'right' }}>
                <span className={styles.score}>{(run.metrics?.score || 0).toFixed(1)}</span>
                <span style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 10 }}>
                  {passRate.toFixed(0)}% pass
                </span>
              </Flexbox>
            </Flexbox>
          )}

          {/* Duration & Cost (completed only) */}
          {run.status === 'completed' && (
            <Flexbox horizontal align="center" className={styles.meta} gap={12}>
              <span style={{ alignItems: 'center', display: 'flex', gap: 4 }}>
                <Icon icon={Clock} size={12} />
                {((run.totalDuration || 0) / 60).toFixed(1)}m
              </span>
              <span style={{ alignItems: 'center', display: 'flex', gap: 4 }}>
                <Icon icon={DollarSign} size={12} />${(run.totalCost || 0).toFixed(2)}
              </span>
            </Flexbox>
          )}

          {/* Actions dropdown */}
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
            <span
              style={{
                alignItems: 'center',
                borderRadius: 4,
                color: 'var(--ant-color-text-tertiary)',
                cursor: 'pointer',
                display: 'flex',
                flexShrink: 0,
                height: 28,
                justifyContent: 'center',
                transition: 'all 0.2s',
                width: 28,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--ant-color-text)';
                e.currentTarget.style.background = 'var(--ant-color-fill-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--ant-color-text-tertiary)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Ellipsis size={16} />
            </span>
          </Dropdown>

          <Icon
            icon={ArrowRight}
            size={16}
            style={{ color: 'var(--ant-color-text-tertiary)', flexShrink: 0 }}
          />
        </Flexbox>
      </Card>
    </Link>
  );
});

export default RunCard;
