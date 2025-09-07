import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "@umijs/max";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Segmented,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import { Viewer } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import Editor, { OnMount } from "@monaco-editor/react";
import {
  getQuestionVoByIdUsingGet,
} from "@/services/oj/questionController";
import {
  debugSubmitUsingPost,
  doQuestionSubmitUsingPost,
} from "@/services/oj/questionSubmitController";
import {
  CodeOutlined,
  HeartOutlined,
  LikeOutlined,
  MoonOutlined,
  PlayCircleOutlined,
  SendOutlined,
  SettingOutlined,
  StarOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { history } from "@umijs/max";
import { PageContainer } from "@ant-design/pro-components";
import { BACKEND_HOST_LOCAL, BACKEND_HOST_PROD } from "@/constants";
import { safeApiId } from "@/utils/utils";

const { Title, Text } = Typography;

/**
 * 编程语言选项
 */
const LANGUAGE_OPTIONS = [
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "Go", value: "go" },
] as const;

/**
 * 默认代码模板
 */
const DEFAULT_SNIPPETS: Record<string, string> = {
  java: `public class Main {\n  public static void main(String[] args) throws Exception {\n    // TODO: write your code here\n  }\n}\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // TODO: write your code here\n    return 0;\n}\n`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    // TODO: write your code here\n}\n`,
};

/**
 * Monaco 编辑器初始化前的配置
 * @param monaco Monaco 实例
 */
const MonacoBeforeMount = (monaco: typeof import("monaco-editor")) => {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
  });
};

/**
 * 题目提交页面
 * @constructor
 */
const SubmitPage: React.FC = () => {
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [question, setQuestion] = useState<API.QuestionVO | undefined>();
  const [language, setLanguage] = useState<string>(LANGUAGE_OPTIONS[0].value);
  const [theme, setTheme] = useState<"light" | "vs-dark">("light");
  const [code, setCode] = useState<string>(DEFAULT_SNIPPETS[LANGUAGE_OPTIONS[0].value]);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const [panelCollapsed, setPanelCollapsed] = useState<boolean>(false);
  const [panelHeight, setPanelHeight] = useState<number>(300);
  const dragInfoRef = useRef<{ dragging: boolean; startY: number; startHeight: number }>({
    dragging: false,
    startY: 0,
    startHeight: 0,
  });

  // 调试运行：多用例输入与输出
  const [caseInputs, setCaseInputs] = useState<string[]>([""]);
  const [caseOutputs, setCaseOutputs] = useState<string[]>([""]);
  const [running, setRunning] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  // 判题状态
  const [judgeStatus, setJudgeStatus] = useState<{ status: 'idle' | 'judging' | 'success' | 'fail'; message?: string }>({ status: 'idle' });

  const mdPlugins = useMemo(() => [gfm()], []);

  /**
   * 获取题目详情
   */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getQuestionVoByIdUsingGet({
      id: safeApiId(id),
    })
      .then((res) => {
        if (res?.data) setQuestion(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /**
   * 切换语言时更新代码模板
   */
  useEffect(() => {
    setCode(DEFAULT_SNIPPETS[language] ?? "");
  }, [language]);

  /**
   * 提交代码
   */
  const handleSubmit = async () => {
      if (!id) return;
      setSubmitting(true);
      setJudgeStatus({ status: 'judging' });
      try {
        // 生成 sid
        const sid = (typeof crypto !== "undefined" && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        // 建立 WebSocket 连接
        const isDev = process.env.NODE_ENV === 'development';
        const backendHost = isDev ? BACKEND_HOST_LOCAL : BACKEND_HOST_PROD;
        const wsUrl = `${backendHost.replace(/^http/, 'ws')}/api/ws/${sid}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        // 处理 WebSocket 连接成功
        ws.onopen = async () => {
          try {
            // 发送提交请求
            const resp = await doQuestionSubmitUsingPost({
              questionId: safeApiId(id),
              language,
              code,
              sid, // 传入 sid
            });

            if (resp?.code !== 0) {
              if (resp?.code === 50001) {
                message.warning("请勿重复提交");
              } else {
                message.error("提交失败");
              }
              ws.close();
              setSubmitting(false);
              setJudgeStatus({ status: 'idle' });
            }
          } catch (e) {
            message.error("提交请求发送失败");
            ws.close();
            setSubmitting(false);
            setJudgeStatus({ status: 'idle' });
          }
        };

        // 处理 WebSocket 消息
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data || "{}");
            const status = data?.status;
            const judgeInfo = data?.judgeInfo;

            // 根据状态显示不同消息
            if (status === 2) {
              message.success("判题通过");
              setJudgeStatus({ status: 'success', message: "判题通过" });
            } else if (status === 3) {
              message.error("判题未通过");
              setJudgeStatus({ status: 'fail', message: "判题未通过" });
            }

            // 获取一次消息后关闭连接
            ws.close();
          } catch (e) {
            message.error("解析判题结果失败");
            setJudgeStatus({ status: 'idle', message: "解析判题结果失败" });
          } finally {
            setSubmitting(false);
          }
        };

        // 处理 WebSocket 错误
        ws.onerror = () => {
          message.error("WebSocket 连接失败");
          setSubmitting(false);
          setJudgeStatus({ status: 'idle', message: "WebSocket 连接失败" });
        };

        // 处理 WebSocket 关闭
        ws.onclose = () => {
          wsRef.current = null;
        };

      } catch (e) {
        message.error("提交失败");
        setSubmitting(false);
        setJudgeStatus({ status: 'idle', message: "提交失败" });
      }
    };

  /**
   * 运行调试代码
   */
  const handleRun = async () => {
    if (running) return;
    if (!code?.trim()) {
      message.warning("请先编写代码");
      return;
    }
    // 准备输入列表（至少有一组）
    const inputs = caseInputs.length ? caseInputs : [""];
    // 生成 sid
    const sid = (typeof crypto !== "undefined" && (crypto as any).randomUUID)
      ? (crypto as any).randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    // 重置输出
    setCaseOutputs(Array(inputs.length).fill(""));
    setRunning(true);

    try {
      const isDev = process.env.NODE_ENV === 'development';
      const backendHost = isDev ? BACKEND_HOST_LOCAL : BACKEND_HOST_PROD;
      const wsUrl = `${backendHost.replace(/^http/, 'ws')}/api/ws/${sid}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        try {
          await debugSubmitUsingPost({
            code,
            language,
            inputList: inputs,
            sid,
          });
        } catch (e) {
          message.error("调试请求发送失败");
          setRunning(false);
          ws.close();
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data || "{}") as API.ExecuteCodeResponse;
          const outList = data?.outputList ?? [];
          setCaseOutputs((prev) => {
            const next = [...prev];
            for (let i = 0; i < Math.max(prev.length, outList.length); i++) {
              const output = outList[i];
              next[i] = (output === "" || output === null) ? "无输出" : output;
            }
            return next;
          });
          if (data?.message) {
            message.info(data.message);
          }
        } catch {
          // 忽略无法解析的数据
        } finally {
          setRunning(false);
          try {
            ws.close();
          } catch {
            // 忽略关闭错误
          }
        }
      };

      ws.onerror = () => {
        message.error("WebSocket 连接失败");
        setRunning(false);
      };

      ws.onclose = () => {
        wsRef.current = null;
      };
    } catch (e) {
      message.error("调试运行失败");
      setRunning(false);
    }
  };

  /**
   * 添加测试用例
   */
  const addCase = () => {
    setCaseInputs((arr) => [...arr, ""]);
    setCaseOutputs((arr) => [...arr, ""]);
  };

  /**
   * 删除测试用例
   * @param idx 用例索引
   */
  const removeCase = (idx: number) => {
    setCaseInputs((arr) => arr.filter((_, i) => i !== idx));
    setCaseOutputs((arr) => arr.filter((_, i) => i !== idx));
  };

  /**
   * 更新测试用例输入
   * @param idx 用例索引
   * @param val 输入值
   */
  const updateCaseInput = (idx: number, val: string) => {
    setCaseInputs((arr) => arr.map((v, i) => (i === idx ? val : v)));
  };

  /**
   * 清空所有输出
   */
  const clearOutputs = () => setCaseOutputs((arr) => arr.map(() => ""));

  /**
   * 题目难度映射
   */
  const difficultyMap = {
    0: { text: "困难", color: "red" },
    1: { text: "中等", color: "orange" },
    2: { text: "简单", color: "green" },
  };

  // @ts-ignore
  const difficulty = difficultyMap[question?.difficulty ?? 2];

  /**
   * 判题状态显示
   */
  const renderJudgeStatus = () => {
    if (judgeStatus.status === 'idle') return null;

    return (
      <div
        style={{
          padding: '8px 16px',
          background:
            judgeStatus.status === 'success' ? '#f6ffed' :
            judgeStatus.status === 'fail' ? '#fff2f0' :
            '#e6f7ff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        {judgeStatus.status === 'judging' && <Spin size="small" />}
        <Text
          type={
            judgeStatus.status === 'success' ? 'success' :
            judgeStatus.status === 'fail' ? 'danger' :
            'secondary'
          }
        >
          {judgeStatus.message || (
            judgeStatus.status === 'judging' ? '正在判题中...' :
            judgeStatus.status === 'success' ? '判题通过' :
            '判题未通过'
          )}
        </Text>
      </div>
    );
  };

  /**
   * 右侧工具栏
   */
  const rightToolbar = (
    <Space>
      <Segmented
        value={language}
        onChange={(v) => setLanguage(v as string)}
        options={LANGUAGE_OPTIONS as unknown as any}
      />
      <Tooltip title={theme === "light" ? "切换暗色主题" : "切换亮色主题"}>
        <Button
          icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
          onClick={() => setTheme((t) => (t === "light" ? "vs-dark" : "light"))}
          type="text"
        />
      </Tooltip>
      <Divider type="vertical" />
      <Space>
        <Button
          icon={<PlayCircleOutlined />}
          onClick={handleRun}
          loading={running}
          type="primary"
          ghost
        >
          运行
        </Button>
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={submitting}
          onClick={handleSubmit}
        >
          提交
        </Button>
      </Space>
    </Space>
  );

  return (
    <PageContainer
      header={{
        title: question?.title || "加载中...",
        breadcrumb: {
          items: [
            { title: <a href="/question">题目列表</a> },
            { title: "提交代码" },
          ],
        },
        extra: rightToolbar,
        onBack: () => history.push('/question'),
      }}
      ghost
      loading={loading}
      style={{
        padding: 0,
        margin: 0,
        height: "90vh",
      }}
    >
      <div style={{ margin: "0 auto", width: "100%" }}>
        {renderJudgeStatus()}
        <Row gutter={[16, 16]} style={{ height: "80vh", overflow: "hidden" }}>
          {/* 题目描述卡片 */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <Text strong>题目描述</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      padding: "2px 8px",
                      borderRadius: 4,
                      backgroundColor: difficulty.color, // 使用背景色而不是边框色
                      color: 'white', // 白色文字以确保可读性
                    }}
                  >
                    {difficulty.text}
                  </Text>
                </Space>
              }
              extra={
                <Button
                  size="small"
                  onClick={() => history.push(`/question/submit/result?questionId=${safeApiId(id)}`)}
                >
                  提交记录
                </Button>
              }
              style={{ height: "100%", borderRadius: 8 }}
              bodyStyle={{ padding: 0, height: "calc(100% - 56px)" }}
            >
              <div style={{ padding: 16, height: "100%", overflowY: "auto" }}>
                <Viewer value={question?.content ?? "暂无题面"} plugins={mdPlugins} />
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  background: "#fafafa",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Space>
                  <Space>
                    <SettingOutlined style={{ color: "#1890ff" }} />
                    <Text strong>判题限制</Text>
                  </Space>
                  <Space>
                    <Text type="secondary">时间:</Text>
                    <Text>{(question?.judgeConfig?.timeLimit ?? 1000)} ms</Text>
                  </Space>
                  <Space>
                    <Text type="secondary">内存:</Text>
                    <Text>{(question?.judgeConfig?.memoryLimit ?? 256)} MB</Text>
                  </Space>
                  <Space>
                    <Text type="secondary">栈限制:</Text>
                    <Text>{(question?.judgeConfig?.stackLimit ?? 128)} MB</Text>
                  </Space>
                </Space>
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Space>
                  <Space>
                    <Text type="secondary">通过:</Text>
                    <Text>{question?.acceptedNum ?? 0}</Text>
                  </Space>
                  <Space>
                    <Text type="secondary">通过率:</Text>
                    <Text>
                      {(() => {
                        const a = question?.acceptedNum ?? 0;
                        const s = question?.submitNum ?? 0;
                        return s ? `${((a / s) * 100).toFixed(1)}%` : "0.0%";
                      })()}
                    </Text>
                  </Space>
                </Space>
                <Space size="middle">
                  <Space>
                    <StarOutlined />
                    <Text>{question?.favourNum ?? 0}</Text>
                  </Space>
                  <Space>
                    <LikeOutlined />
                    <Text>{question?.thumbNum ?? 0}</Text>
                  </Space>
                  <HeartOutlined />
                </Space>
              </div>
            </Card>
          </Col>

          {/* 代码编辑器卡片 */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <CodeOutlined />
                  <Text strong>代码编辑器</Text>
                </Space>
              }
              style={{ height: "100%", borderRadius: 8 }}
              bodyStyle={{ padding: 0, height: "calc(100% - 56px)" }}
            >
              <div style={{ height: `calc(100% - ${panelCollapsed ? 40 : panelHeight}px)`, position: "relative" }}>
                <Editor
                  height="100%"
                  defaultLanguage={language}
                  language={language}
                  theme={theme}
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  beforeMount={MonacoBeforeMount}
                  onMount={(editor) => (editorRef.current = editor)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    tabSize: 2,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: "on",
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    scrollbar: {
                      vertical: "visible",
                      horizontal: "visible",
                    },
                  }}
                />
              </div>

              {/* 测试用例面板 */}
              <div
                style={{
                  height: panelCollapsed ? 40 : panelHeight,
                  transition: "height 0.3s ease",
                  overflow: "hidden",
                  borderTop: "1px solid #f0f0f0",
                  minHeight: panelCollapsed ? 40 : 200,
                }}
              >
                <div
                  onMouseDown={(e) => {
                    dragInfoRef.current = {
                      dragging: true,
                      startY: e.clientY,
                      startHeight: panelHeight,
                    };
                    const onMove = (ev: MouseEvent) => {
                      if (!dragInfoRef.current.dragging) return;
                      const delta = dragInfoRef.current.startY - ev.clientY;
                      const next = Math.min(500, Math.max(200, dragInfoRef.current.startHeight + delta));
                      setPanelHeight(next);
                    };
                    const onUp = () => {
                      dragInfoRef.current.dragging = false;
                      window.removeEventListener("mousemove", onMove);
                      window.removeEventListener("mouseup", onUp);
                    };
                    window.addEventListener("mousemove", onMove);
                    window.addEventListener("mouseup", onUp);
                  }}
                  style={{
                    height: 6,
                    cursor: "ns-resize",
                    background: "#e8e8e8",
                    marginTop: -6,
                    marginBottom: 6,
                  }}
                />
                <div
                  style={{
                    padding: "8px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={5} style={{ margin: 0 }}>
                    测试用例
                  </Title>
                  <Space>
                    <Button size="small" onClick={addCase}>
                      添加用例
                    </Button>
                    <Button size="small" onClick={clearOutputs}>
                      清空输出
                    </Button>
                  </Space>
                </div>
                {!panelCollapsed && (
                  <div style={{ padding: "0 16px 16px", maxHeight: "calc(100% - 60px)", overflowY: "auto" }}>
                    {caseInputs.map((inp, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginBottom: 12,
                          padding: 12,
                          border: "1px solid #e8e8e8",
                          borderRadius: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 8,
                          }}
                        >
                          <Text strong>输入 #{idx + 1}</Text>
                          {caseInputs.length > 1 && (
                            <Button
                              size="small"
                              danger
                              onClick={() => removeCase(idx)}
                            >
                              删除
                            </Button>
                          )}
                        </div>
                        <Input.TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          placeholder="在此粘贴该用例的输入"
                          value={inp}
                          onChange={(e) => updateCaseInput(idx, e.target.value)}
                          style={{ fontSize: 14 }}
                        />
                        <div style={{ marginTop: 8 }}>
                          <Text strong style={{ marginBottom: 8, display: "block" }}>
                            输出 #{idx + 1}
                          </Text>
                          <Input.TextArea
                            autoSize={{ minRows: 1, maxRows: 6 }}
                            readOnly
                            placeholder="运行结果将在此显示"
                            value={caseOutputs[idx] ?? ""}
                            style={{
                              borderColor: (caseOutputs[idx] && caseOutputs[idx] !== "无输出")
                                ? "#52c41a"
                                : "#ff4d4f",
                              fontSize: 14,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default SubmitPage;
