import React, {useMemo, useState} from 'react';
import {Avatar, Badge, Space, Tag, Typography, Card} from 'antd';
import {
  LikeOutlined,
  StarOutlined,
  UserOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import {listQuestionSubmitStatusVoByPageUsingPost} from '@/services/oj/questionController';
import ScorllBanner from '@/components/ScorllBanner';
import {Drawer, Select, Button} from 'antd';
import {history} from '@umijs/max';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import type {ProColumns, ActionType} from '@ant-design/pro-components';
import {formatId, formatChineseDate} from '@/utils/utils';
import './index.less';
import { FaCheck, FaSpinner } from 'react-icons/fa';

const {Text} = Typography;

/**
 * 题目列表项类型定义
 */
type QuestionItem = NonNullable<API.PageQuestionWithSubmitStatusVO_['records']>[number];

/**
 * 每页显示题目数量
 */
const PAGE_SIZE = 10;

/**
 * 难度文本组件
 * @param props - 组件属性
 * @returns React组件
 */
const DifficultyText: React.FC<{ value?: number }> = ({value}) => {
  const map = useMemo(() => {
    return {
      0: {text: '困难', color: '#ff4d4f'},
      1: {text: '中等', color: '#d4a106'},
      2: {text: '简单', color: '#52c41a'},
    } as const;
  }, []);

  if (value === undefined || value === null) return <Text>-</Text>;
  const item = map[value as 0 | 1 | 2] ?? {text: '-', color: undefined};
  return <Text style={{color: item.color}}>{item.text}</Text>;
};

/**
 * 通过率组件
 * @param props - 组件属性
 * @returns React组件
 */
const PassRate: React.FC<{ accepted?: number; submitted?: number }> = ({
                                                                         accepted,
                                                                         submitted,
                                                                       }) => {
  const a = accepted ?? 0;
  const s = submitted ?? 0;
  if (!s)
    return (
      <Space size={4}>
        <Text>{`${0.0}%`}</Text>
        <Text type="secondary">{`(${a}/${s})`}</Text>
      </Space>
    );
  const rate = ((a / s) * 100).toFixed(1);
  return (
    <Space size={4}>
      <Text>{`${rate}%`}</Text>
      <Text type="secondary">{`(${a}/${s})`}</Text>
    </Space>
  );
};

/**
 * 标签组件
 * @param props - 组件属性
 * @returns React组件
 */
const Labels: React.FC<{ tags?: string[] }> = ({tags}) => {
  if (!tags || tags.length === 0) return <Text type="secondary">无标签</Text>;
  return (
    <Space size={[8, 8]} wrap>
      {tags.map((t) => (
        <Tag
          key={t}
          bordered
          style={{
            borderRadius: 12,
            padding: '2px 10px',
            fontSize: 12,
          }}
        >
          {t}
        </Tag>
      ))}
    </Space>
  );
};

/**
 * 题目列表页面组件
 * @returns React组件
 */
const QuestionListPage: React.FC = () => {
  const actionRef = React.useRef<ActionType>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  /**
   * 表格列配置
   */
  const columns: ProColumns<QuestionItem>[] = [
    {
      dataIndex: 'submitStatus',
      key: 'submitStatus',
      width: 40,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        const status = record.submitStatus;

        // 未开始或未通过
        if (status === 3 || status === -1 || status === undefined) {
          return null;
        }

        // 判题中 (0, 1)
        if (status === 0 || status === 1) {
          return <FaSpinner className="status-spinner" style={{ fontSize: 16, color: '#1890ff' }} />;
        }

        // 已完成 (2)
        if (status === 2) {
          return <FaCheck style={{ fontSize: 16, color: '#52c41a' }} />;
        }

        return null;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      hideInSearch: false,
      render: (_, record) => (
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Badge color="#1677ff"/>
            <Text strong ellipsis style={{maxWidth: 300, fontSize: 16}}>
              {record.title ?? '-'}
            </Text>
          </div>
          <div>
            <Labels tags={record.tags}/>
          </div>
        </div>
      ),
    },
    {
      title: '通过率',
      dataIndex: 'acceptedNum',
      key: 'acceptedNum',
      width: 140,
      align: 'center',
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <PassRate accepted={record.acceptedNum} submitted={record.submitNum}/>
      ),
    },
    {
      title: '提交数',
      dataIndex: 'submitNum',
      hideInTable: true,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '互动数据',
      dataIndex: 'thumbNum',
      key: 'thumbNum',
      width: 140,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Space size={6}>
            <LikeOutlined style={{color: '#ff4d4f'}}/>
            <Text>{record.thumbNum ?? 0}</Text>
          </Space>
          <Space size={6}>
            <StarOutlined style={{color: '#faad14'}}/>
            <Text>{record.favourNum ?? 0}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 90,
      align: 'center',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        0: {text: '困难', status: 'Error'},
        1: {text: '中等', status: 'Warning'},
        2: {text: '简单', status: 'Success'},
      },
      filters: true,
      onFilter: true,
      render: (_, record) => <DifficultyText value={record.difficulty}/>,
    },
    {
      title: '创建者',
      dataIndex: 'userVO',
      key: 'userVO',
      width: 140,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Avatar
            size={32}
            src={
              record.userVO?.userAvatar ??
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
            }
            icon={<UserOutlined/>}
          />
          <Text style={{maxWidth: 120, fontSize: 12}} ellipsis>
            {record.userVO?.userName ?? '神秘用户'}
          </Text>
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 170,
      align: 'center',
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <Text type="secondary" style={{fontSize: 12}}>
          {formatChineseDate(record.updateTime as unknown as number | string)}
        </Text>
      ),
    },
  ];

  return (
    <PageContainer
      title="题目列表"
      subTitle="在线编程题目集合"
    >
      <div style={{maxWidth: 1400, margin: '0 auto', width: '100%'}}>
        {/* Banner区域 */}
        <Card style={{marginBottom: 24, borderRadius: 12}}>
          <ScorllBanner
            images={[
              {src: '/imgs/题库顶部banner.png', alt: '题库顶部banner'},
              {src: '/imgs/八股文题库.png', alt: '八股文题库'},
              {src: '/imgs/题库_首页.png', alt: '题库首页'},
              {src: '/imgs/算法训练营.png', alt: '算法训练营'},
              {src: '/imgs/题库顶部banner.png', alt: '题库顶部banner'},
              {src: '/imgs/八股文题库.png', alt: '八股文题库'},
              {src: '/imgs/题库_首页.png', alt: '题库首页'},
            ]}
            height={160}
          />
        </Card>

        {/* 题目列表表格 */}
        <ProTable<QuestionItem>
          actionRef={actionRef}
          columns={columns}
          request={async (params, sort, filter) => {
            // 处理排序字段映射
            let sortField = 'updateTime';
            let sortOrder = 'descend';

            if (sort?.title) {
              sortField = 'title';
              sortOrder = sort.title;
            } else if (sort?.updateTime) {
              sortField = 'updateTime';
              sortOrder = sort.updateTime;
            } else if (sort?.acceptedNum) {
              sortField = 'acceptedNum';
              sortOrder = sort.acceptedNum;
            } else if (sort?.submitNum) {
              sortField = 'submitNum';
              sortOrder = sort.submitNum;
            } else if (sort?.difficulty) {
              sortField = 'difficulty';
              sortOrder = sort.difficulty;
            }

            // 获取筛选值
            // @ts-ignore
            const difficultyFilter = filter?.difficulty as
              | string
              | undefined;

            const res = await listQuestionSubmitStatusVoByPageUsingPost({
              current: params.current || 1,
              pageSize: params.pageSize || PAGE_SIZE,
              sortField,
              sortOrder,
              title: params.title || undefined,
              userId: params.userId,
              difficulty:
                difficultyFilter !== undefined
                  ? parseInt(difficultyFilter, 10)
                  : undefined,
            });

            return {
              data: res?.data?.records || [],
              success: true,
              total: res?.data?.total || 0,
            };
          }}
          rowKey={(record) => formatId(record.id)}
          search={{
            labelWidth: 'auto',
            searchText: '搜索',
            resetText: '重置',
            optionRender: ({searchText, resetText}, {form}) => [
              <Button
                key="search"
                type="primary"
                onClick={() => {
                  form?.submit();
                }}
              >
                {searchText}
              </Button>,
              <Button
                key="reset"
                onClick={() => {
                  form?.resetFields();
                }}
              >
                {resetText}
              </Button>,
            ],
            style: {
              background: 'white',
            },
          }}
          columnsState={{
            persistenceKey: 'question-table',
            persistenceType: 'localStorage',
          }}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
          }}
          dateFormatter="string"
          headerTitle="题目列表"
          toolBarRender={() => []}
          options={{
            reload: true,
            density: true,
            fullScreen: true,
            setting: true,
          }}
          tableStyle={{
            borderRadius: 128,
            background: '#fff',
          }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
          }
          onRow={(record) => ({
            onClick: () => {
              if (record.id) {
                history.push(`/question/submit/${formatId(record.id)}`);
              }
            },
            style: {
              cursor: 'pointer',
              borderRadius: 12,
              margin: '4px 0',
            },
          })}
        />
      </div>
    </PageContainer>
  );
};

export default QuestionListPage;
