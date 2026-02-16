'use client';

import { Flexbox, Icon } from '@lobehub/ui';
import { Card } from 'antd';
import { Activity, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface StatsCardsProps {
  metrics?: {
    averageScore?: number;
    cost?: number;
    duration?: number;
    failedCases?: number;
    passRate?: number;
    passedCases?: number;
    totalCases?: number;
  };
}

const StatsCards = memo<StatsCardsProps>(({ metrics }) => {
  const { t } = useTranslation('eval');

  const passedCount = metrics?.passedCases ?? 0;
  const completedCount = passedCount + (metrics?.failedCases ?? 0);

  const cards = [
    {
      bgColor: 'var(--ant-color-success-bg)',
      color: 'var(--ant-color-success)',
      icon: CheckCircle2,
      label: t('run.metrics.passRate'),
      subtitle: completedCount > 0 ? `${passedCount} / ${completedCount}` : undefined,
      value: metrics?.passRate !== undefined ? `${Math.round(metrics.passRate * 100)}%` : '-',
    },
    {
      bgColor: 'var(--ant-color-primary-bg)',
      color: 'var(--ant-color-primary)',
      icon: Activity,
      label: t('run.metrics.avgScore'),
      value: metrics?.averageScore !== undefined ? metrics.averageScore.toFixed(2) : '-',
    },
    {
      bgColor: 'var(--ant-color-warning-bg)',
      color: 'var(--ant-color-warning)',
      icon: Clock,
      label: t('run.metrics.duration'),
      subtitle: metrics?.duration !== undefined ? `${metrics.duration}ms total` : undefined,
      value: metrics?.duration !== undefined ? `${(metrics.duration / 1000).toFixed(1)}s` : '-',
    },
    {
      bgColor: 'var(--ant-color-primary-bg)',
      color: 'var(--ant-color-primary)',
      icon: DollarSign,
      label: t('run.metrics.cost'),
      subtitle:
        metrics?.cost !== undefined && completedCount > 0
          ? `~$${(metrics.cost / completedCount).toFixed(4)}/case`
          : undefined,
      value: metrics?.cost !== undefined ? `$${metrics.cost.toFixed(2)}` : '-',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      }}
    >
      {cards.map((card) => (
        <Card key={card.label} styles={{ body: { padding: 16 } }}>
          <Flexbox horizontal align="center" gap={12}>
            <div
              style={{
                alignItems: 'center',
                background: card.bgColor,
                borderRadius: 8,
                display: 'flex',
                flexShrink: 0,
                height: 36,
                justifyContent: 'center',
                width: 36,
              }}
            >
              <Icon icon={card.icon} size={16} style={{ color: card.color }} />
            </div>
            <Flexbox gap={2}>
              <span style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 12 }}>
                {card.label}
              </span>
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>{card.value}</span>
              {card.subtitle && (
                <span style={{ color: 'var(--ant-color-text-quaternary)', fontSize: 10 }}>
                  {card.subtitle}
                </span>
              )}
            </Flexbox>
          </Flexbox>
        </Card>
      ))}
    </div>
  );
});

export default StatsCards;
