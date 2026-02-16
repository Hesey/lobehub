'use client';

import { DEFAULT_INBOX_AVATAR, INBOX_SESSION_ID, SESSION_CHAT_URL } from '@lobechat/const';
import { ActionIcon, Avatar } from '@lobehub/ui';
import { App, Form, Input, Modal, Select } from 'antd';
import { SquareArrowOutUpRight } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { agentService } from '@/services/agent';
import { useEvalStore } from '@/store/eval';

interface AgentOption {
  avatar?: string | null;
  backgroundColor?: string | null;
  description?: string | null;
  id: string;
  title?: string | null;
}

interface RunEditModalProps {
  onClose: () => void;
  open: boolean;
  run: any;
}

const RunEditModal = memo<RunEditModalProps>(({ open, onClose, run }) => {
  const { t } = useTranslation('eval');
  const { t: tChat } = useTranslation('chat');
  const { message } = App.useApp();
  const updateRun = useEvalStore((s) => s.updateRun);
  const datasetList = useEvalStore((s) => s.datasetList);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  const canChangeConfig = run?.status === 'idle';

  useEffect(() => {
    if (!open || !canChangeConfig) return;
    setLoadingAgents(true);
    agentService
      .queryAgents()
      .then((list) => setAgents(list as AgentOption[]))
      .finally(() => setLoadingAgents(false));
  }, [open, canChangeConfig]);

  useEffect(() => {
    if (open && run) {
      form.setFieldsValue({
        datasetId: run.datasetId,
        name: run.name,
        targetAgentId: run.targetAgentId,
      });
    }
  }, [open, run]);

  const inboxAgent: AgentOption = useMemo(
    () => ({
      avatar: DEFAULT_INBOX_AVATAR,
      id: INBOX_SESSION_ID,
      title: tChat('inbox.title'),
    }),
    [tChat],
  );

  const allAgents = useMemo(() => [inboxAgent, ...agents], [inboxAgent, agents]);

  const agentOptions = useMemo(
    () =>
      allAgents.map((agent) => ({
        label: (
          <span style={{ alignItems: 'center', display: 'inline-flex', gap: 8 }}>
            <Avatar
              avatar={agent.avatar || undefined}
              background={agent.backgroundColor || undefined}
              size={20}
              title={agent.title || ''}
            />
            <span>{agent.title}</span>
          </span>
        ),
        searchLabel: agent.title || '',
        value: agent.id,
      })),
    [allAgents],
  );

  const handleOpenAgent = useCallback((agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = SESSION_CHAT_URL(agentId);
    window.open(url, `agent_${agentId}`, 'noopener,noreferrer');
  }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      await updateRun({
        datasetId: canChangeConfig ? values.datasetId : undefined,
        id: run.id,
        name: values.name,
        targetAgentId: canChangeConfig ? values.targetAgentId : undefined,
      });
      message.success(t('run.edit.success'));
      onClose();
    } catch {
      message.error(t('run.edit.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      confirmLoading={loading}
      okText={t('benchmark.edit.confirm')}
      open={open}
      title={t('run.edit.title')}
      onCancel={handleClose}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item label={t('run.create.name')} name="name">
          <Input placeholder={t('run.create.name.placeholder')} variant="filled" />
        </Form.Item>

        {canChangeConfig && (
          <>
            <Form.Item
              label={t('run.create.dataset')}
              name="datasetId"
              rules={[{ message: t('run.create.dataset.required'), required: true }]}
            >
              <Select
                placeholder={t('run.create.dataset.placeholder')}
                variant="filled"
                options={datasetList.map((ds) => ({
                  label: (
                    <span>
                      {ds.name}
                      {ds.testCaseCount !== undefined && (
                        <span
                          style={{
                            color: 'var(--ant-color-text-quaternary)',
                            fontSize: 12,
                            marginLeft: 8,
                          }}
                        >
                          {t('run.create.caseCount', { count: ds.testCaseCount })}
                        </span>
                      )}
                    </span>
                  ),
                  value: ds.id,
                }))}
              />
            </Form.Item>

            <Form.Item label={t('run.create.agent')} name="targetAgentId">
              <Select
                allowClear
                showSearch
                loading={loadingAgents}
                options={agentOptions}
                placeholder={t('run.create.agent.placeholder')}
                variant="filled"
                filterOption={(input, option) =>
                  (option?.searchLabel as string)?.toLowerCase().includes(input.toLowerCase())
                }
                optionRender={(option) => (
                  <span
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      gap: 8,
                      justifyContent: 'space-between',
                    }}
                  >
                    {option.label}
                    <ActionIcon
                      icon={SquareArrowOutUpRight}
                      size="small"
                      onClick={(e) => handleOpenAgent(option.value as string, e)}
                    />
                  </span>
                )}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
});

export default RunEditModal;
