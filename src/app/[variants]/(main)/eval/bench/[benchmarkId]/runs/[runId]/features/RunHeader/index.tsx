'use client';

import { SESSION_CHAT_URL } from '@lobechat/const';
import { ActionIcon, Avatar, Flexbox } from '@lobehub/ui';
import { App, Button, Card, Popconfirm, Progress, Typography } from 'antd';
import { ArrowLeft, ChevronDown, ChevronUp, Pencil, Play, Square, Trash2 } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import RunEditModal from '@/app/[variants]/(main)/eval/bench/[benchmarkId]/features/RunEditModal';
import StatusBadge from '@/app/[variants]/(main)/eval/features/StatusBadge';
import { useEvalStore } from '@/store/eval';

interface RunHeaderProps {
  benchmarkId: string;
  hideStart?: boolean;
  run: any;
}

const RunHeader = memo<RunHeaderProps>(({ run, benchmarkId, hideStart }) => {
  const { t } = useTranslation('eval');
  const { modal, message } = App.useApp();
  const navigate = useNavigate();
  const abortRun = useEvalStore((s) => s.abortRun);
  const deleteRun = useEvalStore((s) => s.deleteRun);
  const startRun = useEvalStore((s) => s.startRun);
  const isActive = run.status === 'running' || run.status === 'pending';
  const canStart = run.status === 'idle' || run.status === 'failed' || run.status === 'aborted';
  const [starting, setStarting] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const snapshot = run.config?.agentSnapshot;
  const agentTitle = run.targetAgent?.title || t('run.detail.agent.unnamed');
  const agentAvatar = snapshot?.avatar || run.targetAgent?.avatar;
  const agentModel = snapshot?.model || run.targetAgent?.model;
  const agentProvider = snapshot?.provider || run.targetAgent?.provider;

  const progress =
    run.metrics?.totalCases > 0
      ? Math.round(
          ((run.metrics.passedCases + run.metrics.failedCases) / run.metrics.totalCases) * 100,
        )
      : 0;

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

  const handleOpenAgent = () => {
    if (run.targetAgentId) {
      const url = SESSION_CHAT_URL(run.targetAgentId);
      window.open(url, '_blank');
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString();
  };

  return (
    <Flexbox gap={16}>
      {/* Back link */}
      <Link
        to={`/eval/bench/${benchmarkId}`}
        style={{
          alignItems: 'center',
          color: 'var(--ant-color-text-tertiary)',
          display: 'inline-flex',
          fontSize: 14,
          gap: 4,
          textDecoration: 'none',
          transition: 'color 0.2s',
          width: 'fit-content',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--ant-color-text)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--ant-color-text-tertiary)';
        }}
      >
        <ArrowLeft size={16} />
        {t('run.detail.backToBenchmark')}
      </Link>

      {/* Header Card */}
      <Card styles={{ body: { padding: 20 } }}>
        {/* Title row */}
        <Flexbox horizontal align="start" justify="space-between" style={{ marginBottom: 16 }}>
          <Flexbox gap={4}>
            <Flexbox horizontal align="center" gap={8}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {run.name || run.id.slice(0, 8)}
              </Typography.Title>
              <StatusBadge status={run.status} />
            </Flexbox>
            {/* Meta info row */}
            <Flexbox
              horizontal
              align="center"
              gap={8}
              style={{ color: 'var(--ant-color-text-tertiary)', flexWrap: 'wrap', fontSize: 13 }}
            >
              {run.dataset && (
                <Link
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  target="_blank"
                  to={`/eval/bench/${benchmarkId}/datasets/${run.dataset.id}`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--ant-color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--ant-color-text-tertiary)';
                  }}
                >
                  {run.dataset.name}
                </Link>
              )}
              {run.targetAgentId && (
                <>
                  <span style={{ color: 'var(--ant-color-border)' }}>|</span>
                  <Flexbox
                    horizontal
                    align="center"
                    gap={4}
                    style={{ cursor: 'pointer' }}
                    onClick={handleOpenAgent}
                  >
                    <Avatar avatar={agentAvatar} size={16} />
                    <span>{agentTitle}</span>
                  </Flexbox>
                </>
              )}
              {agentModel && (
                <>
                  <span style={{ color: 'var(--ant-color-border)' }}>|</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {agentProvider ? `${agentProvider} / ` : ''}
                    {agentModel}
                  </span>
                </>
              )}
              {run.createdAt && (
                <>
                  <span style={{ color: 'var(--ant-color-border)' }}>|</span>
                  <span>{formatDate(run.createdAt)}</span>
                </>
              )}
            </Flexbox>
          </Flexbox>
          {/* Actions */}
          <Flexbox horizontal gap={8}>
            {canStart && !hideStart && (
              <Button
                icon={<Play size={14} />}
                loading={starting}
                type="primary"
                onClick={handleStart}
              >
                {t('run.actions.start')}
              </Button>
            )}
            <ActionIcon
              icon={Pencil}
              size="small"
              title={t('run.actions.edit')}
              onClick={() => setEditOpen(true)}
            />
            {isActive && (
              <Popconfirm title={t('run.actions.abort.confirm')} onConfirm={handleAbort}>
                <ActionIcon icon={Square} size="small" title={t('run.actions.abort')} />
              </Popconfirm>
            )}
            <Popconfirm title={t('run.actions.delete.confirm')} onConfirm={handleDelete}>
              <ActionIcon icon={Trash2} size="small" title={t('run.actions.delete')} />
            </Popconfirm>
          </Flexbox>
        </Flexbox>

        {/* Progress bar */}
        {run.metrics?.totalCases > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Flexbox
              horizontal
              align="center"
              justify="space-between"
              style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 12, marginBottom: 6 }}
            >
              <span>
                {t('run.detail.progress')}: {run.metrics.passedCases + run.metrics.failedCases}/
                {run.metrics.totalCases} {t('run.detail.progressCases')}
              </span>
              <span>{progress}%</span>
            </Flexbox>
            <Progress
              percent={progress}
              showInfo={false}
              size="small"
              status={isActive ? 'active' : undefined}
            />
          </div>
        )}

        {/* Collapsible config */}
        <button
          style={{
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            color: 'var(--ant-color-text-tertiary)',
            cursor: 'pointer',
            display: 'flex',
            fontSize: 12,
            gap: 4,
            padding: 0,
            transition: 'color 0.2s',
          }}
          onClick={() => setShowConfig(!showConfig)}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--ant-color-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--ant-color-text-tertiary)';
          }}
        >
          {showConfig ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {t('run.detail.configSnapshot')}
        </button>
        {showConfig && (
          <div
            style={{
              background: 'var(--ant-color-fill-quaternary)',
              borderRadius: 6,
              display: 'grid',
              fontFamily: 'monospace',
              fontSize: 12,
              gap: 8,
              gridTemplateColumns: 'repeat(2, 1fr)',
              marginTop: 12,
              padding: 12,
            }}
          >
            <span style={{ color: 'var(--ant-color-text-secondary)' }}>
              {t('run.detail.model')}: {agentModel || '-'}
            </span>
            <span style={{ color: 'var(--ant-color-text-secondary)' }}>
              {t('run.detail.agent')}: {agentTitle}
            </span>
            <span style={{ color: 'var(--ant-color-text-secondary)' }}>
              {t('run.detail.dataset')}: {run.dataset?.name || '-'}
            </span>
            {run.config?.concurrency && (
              <span style={{ color: 'var(--ant-color-text-secondary)' }}>
                {t('run.config.concurrency')}: {run.config.concurrency}
              </span>
            )}
          </div>
        )}
      </Card>

      <RunEditModal open={editOpen} run={run} onClose={() => setEditOpen(false)} />
    </Flexbox>
  );
});

export default RunHeader;
