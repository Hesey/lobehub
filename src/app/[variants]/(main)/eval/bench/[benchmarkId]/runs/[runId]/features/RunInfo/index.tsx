'use client';

import { SESSION_CHAT_URL } from '@lobechat/const';
import { Avatar, Button } from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { Descriptions, Tag, Typography } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface RunInfoProps {
  run: {
    config?: {
      agentSnapshot?: {
        avatar?: string | null;
        model?: string | null;
        provider?: string | null;
        title?: string | null;
      };
      concurrency?: number;
      timeout?: number;
    };
    dataset?: {
      description?: string | null;
      id: string;
      name: string;
    };
    targetAgent?: {
      avatar: string | null;
      id: string;
      title: string | null;
    };
    targetAgentId?: string | null;
  };
}

const RunInfo = memo<RunInfoProps>(({ run }) => {
  const { t } = useTranslation('eval');

  const snapshot = run.config?.agentSnapshot;
  const agentTitle = run.targetAgent?.title || t('run.detail.agent.unnamed');
  const agentAvatar = snapshot?.avatar || run.targetAgent?.avatar;
  const agentModel = snapshot?.model;
  const agentProvider = snapshot?.provider;

  const handleOpenAgent = () => {
    if (run.targetAgentId) {
      const url = SESSION_CHAT_URL(run.targetAgentId);
      window.open(url, '_blank');
    }
  };

  return (
    <Descriptions
      column={{ lg: 3, md: 2, sm: 1 }}
      items={[
        {
          children: run.dataset ? (
            <Tag>{run.dataset.name}</Tag>
          ) : (
            <Typography.Text type="secondary">-</Typography.Text>
          ),
          key: 'dataset',
          label: t('run.detail.dataset'),
        },
        {
          children: run.targetAgentId ? (
            <Flexbox align="center" gap={8} horizontal>
              <Avatar avatar={agentAvatar} size={20} />
              <Button
                size="small"
                variant="text"
                style={{ height: 'auto', padding: 0 }}
                onClick={handleOpenAgent}
              >
                {agentTitle}
              </Button>
            </Flexbox>
          ) : (
            <Typography.Text type="secondary">{t('run.detail.agent.none')}</Typography.Text>
          ),
          key: 'agent',
          label: t('run.detail.agent'),
        },
        {
          children: agentModel ? (
            <Tag>
              {agentProvider ? `${agentProvider} / ` : ''}
              {agentModel}
            </Tag>
          ) : (
            <Typography.Text type="secondary">-</Typography.Text>
          ),
          key: 'model',
          label: t('run.detail.model'),
        },
      ]}
      size="small"
    />
  );
});

export default RunInfo;
