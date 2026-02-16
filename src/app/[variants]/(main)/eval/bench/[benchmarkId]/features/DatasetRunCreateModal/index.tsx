'use client';

import { DEFAULT_INBOX_AVATAR, INBOX_SESSION_ID, SESSION_CHAT_URL } from '@lobechat/const';
import { Accordion, AccordionItem, ActionIcon, Avatar, Flexbox, Text } from '@lobehub/ui';
import { Button, Dropdown, Form, Input, InputNumber, Modal, Select, Space } from 'antd';
import { css, cssVar, cx } from 'antd-style';
import { ChevronDown, SquareArrowOutUpRight } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { agentService } from '@/services/agent';
import { useEvalStore } from '@/store/eval';

const agentSelectCls = cx(css`
  .ant-select-content-value {
    height: 22px !important;
  }
`);

const timestampLinkCls = cx(css`
  cursor: pointer;
  font-size: 12px;
  transition: color 0.2s;

  &:hover {
    color: ${cssVar.colorText};
  }
`);

interface AgentOption {
  avatar?: string | null;
  backgroundColor?: string | null;
  description?: string | null;
  id: string;
  title?: string | null;
}

interface DatasetRunCreateModalProps {
  benchmarkId: string;
  datasetId: string;
  datasetName: string;
  onClose: () => void;
  open: boolean;
}

const DatasetRunCreateModal = memo<DatasetRunCreateModalProps>(
  ({ open, onClose, benchmarkId, datasetId, datasetName }) => {
    const { t } = useTranslation('eval');
    const { t: tChat } = useTranslation('chat');
    const navigate = useNavigate();
    const createRun = useEvalStore((s) => s.createRun);
    const startRun = useEvalStore((s) => s.startRun);
    const isCreatingRun = useEvalStore((s) => s.isCreatingRun);
    const [form] = Form.useForm();

    const [agents, setAgents] = useState<AgentOption[]>([]);
    const [loadingAgents, setLoadingAgents] = useState(false);

    useEffect(() => {
      if (!open) return;
      setLoadingAgents(true);
      agentService
        .queryAgents()
        .then((list) => setAgents(list as AgentOption[]))
        .finally(() => setLoadingAgents(false));
    }, [open]);

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

    const handleSubmit = async (shouldStart: boolean) => {
      const values = await form.validateFields();
      const run = await createRun({
        config: {
          concurrency: values.concurrency,
          timeout: values.timeout,
        },
        datasetId,
        name: values.name,
        targetAgentId: values.targetAgentId,
      });
      if (run?.id) {
        if (shouldStart) {
          await startRun(run.id);
        }
        navigate(`/eval/bench/${benchmarkId}/runs/${run.id}`);
      }
      onClose();
    };

    const handleClose = () => {
      form.resetFields();
      onClose();
    };

    return (
      <Modal
        open={open}
        title={t('run.create.title')}
        footer={
          <Space>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Space.Compact>
              <Button loading={isCreatingRun} type="primary" onClick={() => handleSubmit(false)}>
                {t('run.create.createOnly')}
              </Button>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'createAndStart',
                      label: t('run.create.confirm'),
                      onClick: () => handleSubmit(true),
                    },
                  ],
                }}
              >
                <Button icon={<ChevronDown size={14} />} loading={isCreatingRun} type="primary" />
              </Dropdown>
            </Space.Compact>
          </Space>
        }
        onCancel={handleClose}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label={t('run.create.name')}
            name="name"
            rules={[{ message: t('run.create.name.required'), required: true }]}
            extra={
              <Text
                className={timestampLinkCls}
                type="secondary"
                onClick={() => {
                  const now = new Date();
                  const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                  form.setFieldsValue({ name: ts });
                }}
              >
                {t('run.create.name.useTimestamp')}
              </Text>
            }
          >
            <Input placeholder={t('run.create.name.placeholder')} variant="filled" />
          </Form.Item>

          <Form.Item
            label={t('run.create.agent')}
            name="targetAgentId"
            rules={[{ message: t('run.create.agent.required'), required: true }]}
          >
            <Select
              allowClear
              showSearch
              className={agentSelectCls}
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

          <Form.Item label={t('run.create.dataset')}>
            <Text>{datasetName}</Text>
          </Form.Item>

          <Accordion>
            <AccordionItem
              itemKey="advanced"
              paddingBlock={6}
              paddingInline={4}
              title={t('run.create.advanced')}
            >
              <Flexbox gap={16} style={{ paddingTop: 8 }}>
                <Form.Item
                  initialValue={5}
                  label={t('run.config.concurrency')}
                  name="concurrency"
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber max={10} min={1} style={{ width: '100%' }} variant="filled" />
                </Form.Item>
                <Form.Item
                  initialValue={300_000}
                  label={t('run.config.timeout')}
                  name="timeout"
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber
                    min={30_000}
                    step={30_000}
                    style={{ width: '100%' }}
                    variant="filled"
                  />
                </Form.Item>
              </Flexbox>
            </AccordionItem>
          </Accordion>
        </Form>
      </Modal>
    );
  },
);

export default DatasetRunCreateModal;
