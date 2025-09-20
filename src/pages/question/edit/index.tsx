import React, {useEffect, useMemo, useState} from 'react';
import {
  Badge,
  Button,
  Modal,
  Space,
  Spin,
  Tag,
  Typography,
  message,
  Drawer,
  Segmented,
  Input,
  Select,
  Pagination,
  Card,
  Row,
  Col,
} from 'antd';
import {
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  LikeOutlined,
  StarOutlined,
  FilterOutlined,
  SwapOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  deleteQuestionUsingPost,
  listMyQuestionVoByPageUsingPost,
} from '@/services/oj-question-service/questionController';
import {history} from '@umijs/max';
import {PageContainer} from '@ant-design/pro-components';

import {formatChineseDate, parseTags, parseJudgeConfig} from '@/utils/utils';

const {Text} = Typography;

/**
 * 题目类型定义
 */
type QuestionItem = API.Question;

/**
 * 每页显示题目数量
 */
const PAGE_SIZE = 10;

/**
 * 难度文本组件
 * @param props 组件属性
 * @returns 难度文本
 */
const DifficultyText: React.FC<{ value?: number }> = ({value}) => {
  const map = useMemo(() => {
    return {
      0: {text: '困难', color: '#ff4d4f'},
      1: {text: '中等', color: '#d4a106'},
      2: {text: '简单', color: '#52c41a'},
    } as const;
  }, []);

  if (value === undefined || value === null) {
    return <Text>-</Text>;
  }

  const item = map[value as 0 | 1 | 2] ?? {text: '-', color: undefined};
  return <Text style={{color: item.color}}>{item.text}</Text>;
};

/**
 * 通过率组件
 * @param props 组件属性
 * @returns 通过率文本
 */
const PassRate: React.FC<{ accepted?: number; submitted?: number }> = ({
                                                                         accepted,
                                                                         submitted,
                                                                       }) => {
  const a = accepted ?? 0;
  const s = submitted ?? 0;

  if (!s) {
    return (
      <Space size={4}>
        <Text>{`${(0).toFixed(1)}%`}</Text>
        <Text type="secondary">{`(${a}/${s})`}</Text>
      </Space>
    );
  }

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
 * @param props 组件属性
 * @returns 标签列表
 */
const Labels: React.FC<{ tags?: string[] }> = ({tags}) => {
  if (!tags || tags.length === 0) {
    return <Text type="secondary">无标签</Text>;
  }

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
 * 题目列表行组件
 * @param props 组件属性
 * @returns 题目列表行
 */
const ListRow: React.FC<{
  item: QuestionItem;
  index: number;
  onEdit: (record: QuestionItem) => void;
  onDelete: (record: QuestionItem) => void;
}> = ({item, index, onEdit, onDelete}) => {
  const bg = index % 2 === 0 ? '#fafafa' : 'transparent';
  const judge = useMemo(() => parseJudgeConfig(item.judgeConfig), [item.judgeConfig]) ?? {};

  return (
    <Card
      size="small"
      style={{
        background: bg,
        marginBottom: 8,
        marginTop: 0,
        borderRadius: 8,
        border: '1px solid #f0f0f0',
      }}
    >
      <Row gutter={16} align="middle">
        <Col span={8}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Badge color="#1677ff"/>
            <Text strong ellipsis style={{maxWidth: '100%'}}>
              {item.title ?? '-'}
            </Text>
          </div>
          <div style={{marginTop: 8}}>
            <Labels tags={parseTags(item.tags)}/>
          </div>
        </Col>

        <Col span={2} style={{textAlign: 'center'}}>
          <PassRate accepted={item.acceptedNum} submitted={item.submitNum}/>
        </Col>

        <Col span={3} style={{textAlign: 'center'}}>
          <Space>
            <Space size={6}>
              <LikeOutlined/>
              <Text>{item.thumbNum ?? 0}</Text>
            </Space>
            <Space size={6}>
              <StarOutlined/>
              <Text>{item.favourNum ?? 0}</Text>
            </Space>
          </Space>
        </Col>

        <Col span={2} style={{textAlign: 'center'}}>
          <DifficultyText value={item.difficulty}/>
        </Col>

        <Col span={3} style={{textAlign: 'center'}}>
          <Space size={6} direction="vertical" style={{width: '100%'}}>
            <Text type="secondary">TL: {judge?.timeLimit ?? '-'}</Text>
            <Text type="secondary">ML: {judge?.memoryLimit ?? '-'}</Text>
          </Space>
        </Col>

        <Col span={4} style={{textAlign: 'center'}}>
          <Space direction="vertical" size={4} style={{width: '100%'}}>
            <Text type="secondary">
              创建: {formatChineseDate(item.createTime as unknown as number | string)}
            </Text>
            <Text type="secondary">
              更新: {formatChineseDate(item.updateTime as unknown as number | string)}
            </Text>
          </Space>
        </Col>

        <Col span={2} style={{textAlign: 'center'}}>
          <Space direction="vertical" size="small">
            <Button block icon={<EditOutlined/>} onClick={() => onEdit(item)} size="small">
              编辑
            </Button>
            <Button
              block
              danger
              icon={<DeleteOutlined/>}
              onClick={() => onDelete(item)}
              size="small"
            >
              删除
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

/**
 * 我创建的题目管理页面
 * @returns 页面组件
 */
const MyQuestionManagePage: React.FC = () => {
  const [list, setList] = useState<QuestionItem[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadTick, setReloadTick] = useState<number>(0);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<number | undefined>(undefined);
  const [sortField, setSortField] = useState<string>('updateTime');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
  const [keyword, setKeyword] = useState<string>('');

  /**
   * 加载题目数据
   * @param page 页码
   */
  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const res = await listMyQuestionVoByPageUsingPost({
        current: page,
        pageSize: PAGE_SIZE,
        sortField,
        sortOrder,
        title: keyword || undefined,
        difficulty,
      });
      const data = res?.data as API.PageQuestion_ | undefined;
      const records = data?.records ?? [];
      setList(records);
      setTotal(data?.total ?? 0);
      setCurrent(page);
    } finally {
      setLoading(false);
    }
  };

  // 初次加载
  useEffect(() => {
    setCurrent(1);
    void loadData(1);
  }, []);

  // 条件变化时重置并重新加载
  useEffect(() => {
    setCurrent(1);
    void loadData(1);
  }, [keyword, difficulty, sortField, sortOrder, reloadTick]);

  /**
   * 编辑题目
   * @param record 题目记录
   */
  const handleEdit = (record: QuestionItem) => {
    if (record?.id) {
      history.push(`/question/edit/${record.id}`, record as any);
    }
  };

  /**
   * 删除题目
   * @param record 题目记录
   */
  const handleDelete = (record: QuestionItem) => {
    Modal.confirm({
      title: '确认删除该题目吗？',
      icon: <ExclamationCircleOutlined/>,
      content: `删除后不可恢复（ID：${record.id}）`,
      okText: '删除',
      okButtonProps: {danger: true},
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在删除...');
        try {
          const resp = await deleteQuestionUsingPost({id: record.id});
          if (resp?.data) {
            message.success('删除成功');
            // 重载列表
            setList([]);
            setCurrent(1);
            await loadData(1);
          } else {
            message.error(resp?.message ?? '删除失败');
          }
        } catch (e) {
          message.error('删除失败，请稍后重试');
        } finally {
          hide();
        }
      },
    });
  };

  /**
   * 新建题目
   */
  const handleAdd = () => {
    history.push('/question/edit/add');
  };

  return (
    <PageContainer title="我创建的题目" subTitle="管理题目集合">
      <div style={{maxWidth: 1400, margin: '0 auto', width: '100%'}}>
        <Card>
          {/* 搜索和筛选区域 */}
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Space wrap>
              <Input
                value={keyword}
                placeholder="搜索题目标题..."
                allowClear
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => {
                  setReloadTick((t) => t + 1);
                }}
                style={{width: 300}}
              />
              <Button icon={<FilterOutlined/>} onClick={() => setFilterOpen(true)}>
                筛选
              </Button>
              <Button icon={<SwapOutlined/>} onClick={() => setSortOpen((v) => !v)}>
                排序
              </Button>
            </Space>

            <Button key="add" type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
              新建题目
            </Button>
          </div>

          {/* 排序选项 */}
          {sortOpen && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                background: '#f5f5f5',
                borderRadius: 6,
              }}
            >
              <Space wrap>
                <Segmented
                  value={sortField}
                  onChange={(v) => setSortField(v as string)}
                  options={[
                    {label: '创建时间', value: 'createTime'},
                    {label: '更新时间', value: 'updateTime'},
                    {label: '通过率', value: 'acceptedNum'},
                    {label: '提交数', value: 'submitNum'},
                    {label: '点赞', value: 'thumbNum'},
                    {label: '收藏', value: 'favourNum'},
                  ]}
                />
                <Segmented
                  value={sortOrder}
                  onChange={(v) => setSortOrder(v as 'ascend' | 'descend')}
                  options={[
                    {label: '升序', value: 'ascend'},
                    {label: '降序', value: 'descend'},
                  ]}
                />
              </Space>
            </div>
          )}

          {/* 列表头部 */}
          <div style={{marginBottom: 16}}>
            <Row
              gutter={16}
              style={{
                fontWeight: 'bold',
                padding: '8px 16px',
                background: '#fafafa',
                borderRadius: 4,
              }}
            >
              <Col span={8}>标题</Col>
              <Col span={2} style={{textAlign: 'center'}}>
                通过率
              </Col>
              <Col span={3} style={{textAlign: 'center'}}>
                互动
              </Col>
              <Col span={2} style={{textAlign: 'center'}}>
                难度
              </Col>
              <Col span={3} style={{textAlign: 'center'}}>
                判题限制
              </Col>
              <Col span={4} style={{textAlign: 'center'}}>
                时间
              </Col>
              <Col span={2} style={{textAlign: 'center'}}>
                操作
              </Col>
            </Row>
          </div>

          {/* 列表内容 */}
          <div>
            {list.map((item, idx) => (
              <ListRow
                key={item.id ?? `${idx}-${item.title}`}
                item={item}
                index={idx}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {loading && (
              <div style={{textAlign: 'center', padding: '24px'}}>
                <Spin tip="加载中..."/>
              </div>
            )}
          </div>

          {/* 分页器 */}
          <div style={{display: 'flex', justifyContent: 'flex-end', padding: '16px 0'}}>
            <Pagination
              current={current}
              pageSize={PAGE_SIZE}
              total={total}
              showSizeChanger={false}
              onChange={(page) => void loadData(page)}
              showQuickJumper
            />
          </div>
        </Card>

        {/* 筛选抽屉 */}
        <Drawer
          title="筛选题目"
          placement="right"
          width={320}
          onClose={() => setFilterOpen(false)}
          open={filterOpen}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            <div>
              <div style={{marginBottom: 8}}>难度</div>
              <Select
                value={difficulty}
                placeholder="全部难度"
                style={{width: '100%'}}
                allowClear
                onChange={(v) => setDifficulty(v as number | undefined)}
                options={[
                  {label: '简单', value: 2},
                  {label: '中等', value: 1},
                  {label: '困难', value: 0},
                ]}
              />
            </div>
            <Button type="primary" onClick={() => setFilterOpen(false)}>
              应用
            </Button>
          </div>
        </Drawer>
      </div>
    </PageContainer>
  );
};

export default MyQuestionManagePage;
