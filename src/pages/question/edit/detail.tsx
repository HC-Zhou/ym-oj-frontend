import React, {useEffect, useMemo, useState} from 'react';

import {
  Button,
  Input,
  InputNumber,
  message,
  Segmented,
  Space,
  Tag,
  Typography,
  Card,
} from 'antd';
import {
  MinusOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  TagsOutlined,
  FontSizeOutlined,
} from '@ant-design/icons';

import {useLocation, useNavigate, useParams} from '@umijs/max';

import {
  addQuestionUsingPost,
  editQuestionUsingPost,
  getQuestionVoByIdUsingGet,
} from '@/services/oj/questionController';

import {safeApiId, parseTags, parseJudgeConfig, parseJudgeCases} from '@/utils/utils';

import {Editor as BytemdEditor} from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import 'bytemd/dist/index.css';

import {PageContainer} from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';

const {Text} = Typography;

/**
 * 判题用例类型定义
 */
type JudgeCaseItem = API.JudgeCase;

/**
 * 难度选择组件
 * @param props 组件属性
 * @returns 难度选择器
 */
const DifficultySegment: React.FC<{
  value?: number;
  onChange: (v: number) => void;
}> = ({value, onChange}) => {
  return (
    <Segmented
      value={value as number}
      onChange={(v) => onChange(v as number)}
      options={[
        {label: '困难', value: 0},
        {label: '中等', value: 1},
        {label: '简单', value: 2},
      ]}
    />
  );
};

/**
 * 带步进器的数字输入组件
 * @param props 组件属性
 * @returns 数字输入组件
 */
const NumberWithStepper: React.FC<{
  label: string;
  value?: number;
  step?: number;
  min?: number;
  max?: number;
  onChange: (v: number | null) => void;
  suffix?: string;
}> = ({label, value, step = 1, min, max, onChange, suffix}) => {
  /**
   * 安全数值处理函数
   * @param v 输入值
   * @returns 处理后的安全值
   */
  const safe = (v: number) => {
    let nv = v;
    if (typeof min === 'number') nv = Math.max(min, nv);
    if (typeof max === 'number') nv = Math.min(max, nv);
    return nv;
  };

  return (
    <div style={{textAlign: 'left'}}>
      <div style={{marginBottom: 8}}>{label}</div>
      <Space.Compact>
        <Button
          onClick={() => onChange(safe((value ?? 0) - step))}
          icon={<MinusOutlined/>}
        />
        <InputNumber
          style={{width: 160}}
          value={value}
          onChange={(v) => onChange((v as number) ?? 0)}
          min={min}
          max={max}
          step={step}
          addonAfter={suffix}
        />
        <Button
          type="primary"
          onClick={() => onChange(safe((value ?? 0) + step))}
          icon={<PlusOutlined/>}
        />
      </Space.Compact>
    </div>
  );
};

/**
 * 标签编辑组件
 * @param props 组件属性
 * @returns 标签编辑器
 */
const TagEditor: React.FC<{
  value?: string[];
  onChange: (v: string[]) => void;
}> = ({value, onChange}) => {
  const [input, setInput] = useState('');
  const tags = useMemo(() => value ?? [], [value]);

  return (
    <div style={{textAlign: 'left'}}>
      <div style={{marginBottom: 8}}>标签</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
        {tags.map((t) => (
          <Tag
            key={t}
            closable
            onClose={(e) => {
              e.preventDefault();
              onChange(tags.filter((x) => x !== t));
            }}
            style={{padding: '4px 10px', borderRadius: 12}}
          >
            {t}
          </Tag>
        ))}
        <Space.Compact>
          <Input
            placeholder="输入标签后回车"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={() => {
              const v = input.trim();
              if (!v) return;
              onChange(Array.from(new Set([...tags, v])));
              setInput('');
            }}
            style={{width: 200}}
          />
          <Button
            type="default"
            onClick={() => {
              const v = input.trim();
              if (!v) return;
              onChange(Array.from(new Set([...tags, v])));
              setInput('');
            }}
          >
            添加
          </Button>
        </Space.Compact>
      </div>
      <div style={{color: '#999', marginTop: 4}}>
        点击标签右侧关闭图标可删除
      </div>
    </div>
  );
};

/**
 * 编辑器插件配置
 */
const plugins = [gfm()];

/**
 * 编辑器配置
 */
const editorConfig = {
  plugins,
  mode: 'split',
  spellcheck: false,
  dropZone: false,
  upload: {images: false},
  fullscreen: false,
};

/**
 * 题目编辑页面组件
 * @returns 题目编辑页面
 */
const QuestionEditPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation() as { state?: Partial<API.Question> };

  const isAddMode = params?.id === 'add';
  const id = isAddMode ? undefined : params?.id;

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [judgeConfig, setJudgeConfig] = useState<API.JudgeConfig>({
    timeLimit: 1000,
    memoryLimit: 256,
    stackLimit: 128,
  });
  const [cases, setCases] = useState<JudgeCaseItem[]>([]);

  // 工具函数已移至 utils.ts 文件中统一管理

  // 从路由 state 初始化数据
  useEffect(() => {
    const s = location?.state;
    if (s) {
      setTitle(s.title ?? '');
      setDifficulty((s.difficulty as number) ?? 1);
      setTags(parseTags(s.tags as unknown as string));
      setContent(s.content ?? '');

      const jc =
        parseJudgeConfig(
          s.judgeConfig as unknown as string | API.JudgeConfig
        ) ?? {};
      setJudgeConfig({
        timeLimit: jc.timeLimit ?? 1000,
        memoryLimit: jc.memoryLimit ?? 256,
        stackLimit: jc.stackLimit ?? 128,
      });
      const arr = parseJudgeCases((s as any).judgeCase);
      if (arr.length) setCases(arr);
    }
  }, []);

  // 编辑模式下拉取题目详情
  useEffect(() => {
    if (isAddMode || !id) return;
    setLoading(true);
    // 使用统一的ID处理函数
    getQuestionVoByIdUsingGet({id: safeApiId(id)})
      .then((res) => {
        const q = res?.data;
        if (!q) return;
        setTitle(q.title ?? '');
        setDifficulty((q.difficulty as number) ?? 1);
        setTags(q.tags ?? []);
        setContent(q.content ?? '');
        const jc =
          parseJudgeConfig(q.judgeConfig as unknown as API.JudgeConfig) ?? {};
        setJudgeConfig({
          timeLimit: jc.timeLimit ?? 1000,
          memoryLimit: jc.memoryLimit ?? 256,
          stackLimit: jc.stackLimit ?? 128,
        });
        const arr = parseJudgeCases((q as any)?.judgeCase);
        if (arr.length) setCases(arr);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /**
   * 保存题目信息
   */
  const save = async () => {
    setSaving(true);
    try {
      if (isAddMode) {
        const resp = await addQuestionUsingPost({
          title,
          difficulty,
          tags,
          content: content?.toString?.() ?? content,
          judgeConfig,
          judgeCase: cases,
        });
        if (resp?.data) {
          message.success('添加成功');
          navigate(-1);
        } else {
          message.error(resp?.message ?? '添加失败');
        }
      } else {
        if (!id) {
          message.error('无效的题目 ID');
          return;
        }
        // 使用统一的ID处理函数
        const resp = await editQuestionUsingPost({
          id: safeApiId(id),
          title,
          difficulty,
          tags,
          content: content?.toString?.() ?? content,
          judgeConfig,
          judgeCase: cases,
        });
        if (resp?.data) {
          message.success('保存成功');
          navigate(-1);
        } else {
          message.error(resp?.message ?? '保存失败');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      loading={loading}
      title={isAddMode ? '添加题目' : '编辑题目'}
      subTitle="填写题目信息、内容与测试用例"
      onBack={() => navigate(-1)}
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined/>} onClick={() => navigate(-1)}>
          返回
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined/>}
          loading={saving}
          onClick={save}
        >
          {isAddMode ? '添加' : '保存'}
        </Button>,
      ]}
      style={{height: '90vh'}}
      breadcrumb={{
        routes: [
          {path: '/question', breadcrumbName: '题目管理'},
          {path: '', breadcrumbName: isAddMode ? '添加题目' : '编辑题目'},
        ]
      }}
    >
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        width: "100%",
        height: '83vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <ProCard title={<><InfoCircleOutlined/> 题目信息</>} headerBordered>
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            <div style={{display: 'flex', gap: 16}}>
              <div style={{flex: 1}}>
                <Text strong><FontSizeOutlined/> 标题</Text>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入题目标题"
                  style={{marginTop: 8}}
                />
              </div>
              <div style={{flex: 1}}>
                <Text strong><SettingOutlined/> 难度</Text>
                <div style={{marginTop: 8}}>
                  <DifficultySegment value={difficulty} onChange={setDifficulty}/>
                </div>
              </div>
            </div>

            <div style={{display: 'flex', gap: 16}}>
              <div style={{flex: 1}}>
                <Text strong><TagsOutlined/> 标签</Text>
                <TagEditor value={tags} onChange={setTags}/>
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, background: "transparent"}}>
                  <Text strong><SettingOutlined/> 判题限制</Text>
                  <Space direction="horizontal" size={16} style={{marginTop: 8}}>
                    <NumberWithStepper
                      label="时间限制"
                      value={judgeConfig.timeLimit}
                      step={100}
                      min={0}
                      suffix="ms"
                      onChange={(v) =>
                        setJudgeConfig((c) => ({
                          ...c,
                          timeLimit: (v ?? 0) as number,
                        }))
                      }
                    />
                    <NumberWithStepper
                      label="内存限制"
                      value={judgeConfig.memoryLimit}
                      step={16}
                      min={0}
                      suffix="MB"
                      onChange={(v) =>
                        setJudgeConfig((c) => ({
                          ...c,
                          memoryLimit: (v ?? 0) as number,
                        }))
                      }
                    />
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </ProCard>

        {/* 主要内容区域 - 题目内容和测试用例 */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, flex: 1, overflow: 'hidden'}}>
          {/* 题目内容区域 - 固定占50% */}
          <ProCard
            title={<><FileTextOutlined/> 题目内容</>}
            headerBordered
            style={{height: '50%', overflow: 'hidden'}}
          >
            <div style={{height: 'calc(100% - 56px)'}}>
              <BytemdEditor
                value={content}
                onChange={setContent}
                {...editorConfig}
                placeholder="在此输入题目内容..."
              />
            </div>
          </ProCard>

          {/* 测试用例区域 - 动态高度 */}
          <ProCard
            title={<><ExperimentOutlined/> 测试用例</>}
            headerBordered
            style={{
              flex: 1,
              overflow: 'auto',
              minHeight: '200px',
              maxHeight: '50vh' // 限制最大高度，避免占用过多空间
            }}
            bodyStyle={{
              padding: '16px',
              maxHeight: 'calc(50vh - 56px)', // 减去标题高度
              overflow: 'auto'
            }}
            extra={
              <Button
                size="small"
                type="dashed"
                icon={<PlusCircleOutlined/>}
                onClick={() => setCases((arr) => [...arr, {input: '', output: ''}])}
              >
                新增用例
              </Button>
            }
          >
            {cases.length === 0 ? (
              <div style={{textAlign: 'center', padding: '24px 0', color: '#999'}}>
                <ExperimentOutlined style={{fontSize: 24, marginBottom: 8}}/>
                <br/>
                <Text type="secondary">暂无用例，点击"新增用例"添加</Text>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxHeight: '100%',
                overflow: 'auto'
              }}>
                {cases.map((c, idx) => (
                  <Card
                    key={idx}
                    size="small"
                    style={{
                      border: '1px solid #e8e8e8',
                      borderRadius: 8,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                      flexShrink: 0, // 防止卡片被压缩
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 80px',
                        gap: 16,
                        padding: 12,
                        alignItems: 'start',
                      }}
                    >
                      <div>
                        <div style={{fontWeight: 500, marginBottom: 8, fontSize: 14}}>
                          <span style={{fontSize: 12}}>📥</span> 输入 #{idx + 1}
                        </div>
                        <Input.TextArea
                          autoSize={{minRows: 2, maxRows: 8}}
                          value={c.input}
                          onChange={(e) =>
                            setCases((arr) =>
                              arr.map((x, i) =>
                                i === idx ? {...x, input: e.target.value} : x
                              )
                            )
                          }
                          placeholder="标准输入内容"
                          style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: 6,
                            fontSize: 13
                          }}
                        />
                      </div>
                      <div>
                        <div style={{fontWeight: 500, marginBottom: 8, fontSize: 14}}>
                          <span style={{fontSize: 12}}>📤</span> 输出 #{idx + 1}
                        </div>
                        <Input.TextArea
                          autoSize={{minRows: 2, maxRows: 8}}
                          value={c.output}
                          onChange={(e) =>
                            setCases((arr) =>
                              arr.map((x, i) =>
                                i === idx ? {...x, output: e.target.value} : x
                              )
                            )
                          }
                          placeholder="期望输出内容"
                          style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: 6,
                            fontSize: 13
                          }}
                        />
                      </div>
                      <div style={{display: 'flex', alignItems: 'flex-end'}}>
                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined/>}
                          onClick={() =>
                            setCases((arr) => arr.filter((_, i) => i !== idx))
                          }
                          style={{borderRadius: 6}}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ProCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default QuestionEditPage;
