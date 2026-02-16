'use client';

import { Flexbox, Tag } from '@lobehub/ui';
import { Input, Select, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface CaseResultsTableProps {
  benchmarkId: string;
  results: any[];
  runId: string;
}

const CaseResultsTable = memo<CaseResultsTableProps>(({ results, benchmarkId, runId }) => {
  const { t } = useTranslation('eval');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredResults = useMemo(() => {
    let filtered = results;
    if (searchText) {
      filtered = filtered.filter((r: any) =>
        r.testCase?.content?.input?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r: any) => {
        const passed = r.topic?.metadata?.passed;
        return statusFilter === 'passed' ? passed : !passed;
      });
    }
    return filtered;
  }, [results, searchText, statusFilter]);

  const columns: ColumnsType<any> = [
    {
      key: 'index',
      render: (_: any, __: any, index: number) => (
        <span
          style={{ color: 'var(--ant-color-text-tertiary)', fontFamily: 'monospace', fontSize: 12 }}
        >
          {index + 1}
        </span>
      ),
      title: '#',
      width: 48,
    },
    {
      dataIndex: ['testCase', 'content', 'input'],
      ellipsis: true,
      key: 'input',
      render: (text: string, record: any) => (
        <Link
          style={{ color: 'inherit', textDecoration: 'none' }}
          to={`/eval/bench/${benchmarkId}/runs/${runId}/cases/${record.testCaseId}`}
        >
          <Typography.Text ellipsis style={{ maxWidth: 400 }}>
            {text}
          </Typography.Text>
        </Link>
      ),
      title: t('table.columns.input'),
    },
    {
      key: 'status',
      render: (_: any, record: any) => {
        const passed = record.topic?.metadata?.passed;
        return passed === undefined ? (
          '-'
        ) : (
          <Tag color={passed ? 'success' : 'error'}>
            {passed ? t('table.filter.passed') : t('table.filter.failed')}
          </Tag>
        );
      },
      title: t('table.columns.status'),
      width: 100,
    },
    {
      key: 'score',
      render: (_: any, record: any) => {
        const score = record.topic?.metadata?.totalScore;
        if (score === undefined) return '-';
        return (
          <span
            style={{
              color:
                score >= 80
                  ? 'var(--ant-color-success)'
                  : score >= 60
                    ? 'var(--ant-color-warning)'
                    : 'var(--ant-color-error)',
              fontFamily: 'monospace',
              fontWeight: 600,
            }}
          >
            {score.toFixed(2)}
          </span>
        );
      },
      title: t('table.columns.score'),
      width: 100,
    },
    {
      key: 'duration',
      render: (_: any, record: any) => {
        const duration = record.topic?.metadata?.duration;
        return duration !== undefined ? (
          <span
            style={{
              color: 'var(--ant-color-text-tertiary)',
              fontFamily: 'monospace',
              fontSize: 12,
            }}
          >
            {(duration / 1000).toFixed(1)}s
          </span>
        ) : (
          '-'
        );
      },
      title: t('table.columns.duration'),
      width: 100,
    },
    {
      dataIndex: ['testCase', 'metadata', 'difficulty'],
      key: 'difficulty',
      render: (difficulty: string) =>
        difficulty ? <Tag>{t(`difficulty.${difficulty}` as any)}</Tag> : '-',
      title: t('table.columns.difficulty'),
      width: 100,
    },
  ];

  return (
    <Flexbox gap={0}>
      {/* Filters */}
      <Flexbox
        horizontal
        gap={8}
        style={{
          borderBlockEnd: '1px solid var(--ant-color-border-secondary)',
          padding: '12px 20px',
        }}
      >
        <Input.Search
          allowClear
          placeholder={t('table.search.placeholder')}
          style={{ width: 240 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          style={{ width: 120 }}
          value={statusFilter}
          options={[
            { label: t('table.filter.all'), value: 'all' },
            { label: t('table.filter.passed'), value: 'passed' },
            { label: t('table.filter.failed'), value: 'failed' },
          ]}
          onChange={setStatusFilter}
        />
      </Flexbox>
      <Table
        columns={columns}
        dataSource={filteredResults}
        pagination={{ pageSize: 20, simple: true, size: 'small' }}
        rowKey="testCaseId"
        size="small"
      />
    </Flexbox>
  );
});

export default CaseResultsTable;
