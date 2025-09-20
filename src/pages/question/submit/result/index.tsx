import React, {useMemo, useRef} from "react";
import {
  Button,
  Space,
  Tag,
  Typography,
  Popover,
  Card,
  Segmented,
  Flex,
  Badge,
} from "antd";
import {
  ClockCircleOutlined,
  FilterOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import {FaJava} from "react-icons/fa6";
import {TbBrandCpp} from "react-icons/tb";
import {FaGolang} from "react-icons/fa6";
import {BsCpu} from "react-icons/bs";
import {listQuestionSubmitByPageUsingPost} from "@/services/oj-question-service/questionController";
import {history, useLocation} from "@umijs/max";

import ProTable, {type ProColumns, type ActionType} from "@ant-design/pro-table";
import ProCard from "@ant-design/pro-card";
import {PageContainer} from "@ant-design/pro-layout";

import {formatId, formatDateTime} from "@/utils/utils";

const {Text} = Typography;

/**
 * 状态文本映射
 */
const STATUS_TEXT: Record<number, string> = {
  0: "待判题",
  1: "判题中",
  2: "通过",
  3: "解答错误",
};

/**
 * 状态颜色样式
 */
const STATUS_STYLE: Record<number, { color: string; icon: React.ReactNode }> = {
  0: {color: "#8c8c8c", icon: <Badge color="#8c8c8c"/>},
  1: {color: "#1890ff", icon: <Badge color="#1890ff"/>},
  2: {color: "#52c41a", icon: <CheckCircleOutlined style={{color: "#52c41a"}}/>},
  3: {color: "#ff4d4f", icon: <CloseCircleOutlined style={{color: "#ff4d4f"}}/>},
};

/**
 * 语言筛选选项
 */
const LANGUAGE_OPTIONS = [
  {label: "全部", value: ""},
  {label: "Java", value: "java"},
  {label: "C++", value: "cpp"},
  {label: "Go", value: "go"},
];

/**
 * 状态筛选选项
 */
const STATUS_OPTIONS = [
  {label: "全部", value: -1},
  {label: "待判题", value: 0},
  {label: "判题中", value: 1},
  {label: "通过", value: 2},
  {label: "错误", value: 3},
];

// 工具函数已移至 utils.ts 文件中统一管理

const ResultPage: React.FC = () => {
  const location = useLocation();
  const actionRef = useRef<ActionType>(null);

  // 筛选状态
  const [languageFilter, setLanguageFilter] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<number>(-1);

  // 提取 questionId
  const questionId = useMemo<string | undefined>(() => {
    try {
      const search =
        location?.search ??
        (history?.location as any)?.search ??
        window.location.search;
      const sp = new URLSearchParams(search);
      return sp.get("questionId") || undefined;
    } catch {
      return undefined;
    }
  }, [location]);

  // 语言图标映射
  const languageIcons: Record<string, React.ReactNode> = {
    java: <FaJava size={16} style={{verticalAlign: 'middle', color: '#e67979'}}/>,
    cpp: <TbBrandCpp size={16} style={{verticalAlign: 'middle', color: '#3d93d1'}}/>,
    go: <FaGolang size={16} style={{verticalAlign: 'middle', color: '#79e6c9'}}/>,
  };

  /**
   * 表格列定义
   */
  const columns: ProColumns<API.QuestionSubmitVO>[] = [
    {
      title: "状态",
      dataIndex: "status",
      width: 130,
      align: "center",
      render: (_, record) => (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
          {STATUS_STYLE[record.status ?? 0]?.icon}
          <Text strong style={{color: STATUS_STYLE[record.status ?? 0]?.color}}>
            {STATUS_TEXT[record.status ?? 0]}
          </Text>
        </div>
      ),
      filters: STATUS_OPTIONS.slice(1).map((opt) => ({text: opt.label, value: opt.value})),
      onFilter: true,
    },
    {
      title: "语言",
      dataIndex: "language",
      width: 120,
      align: "center",
      render: (_, record) => {
        const lang = (record.language ?? "").toLowerCase();
        const icon = languageIcons[lang];
        return (
          <Tag
            color="default"
            style={{
              borderRadius: 12,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            {icon}
            <Text strong>{lang === "cpp" ? "C++" : lang.toUpperCase()}</Text>
          </Tag>
        );
      },
      filters: LANGUAGE_OPTIONS.slice(1).map((opt) => ({text: opt.label, value: opt.value})),
      onFilter: true,
    },
    {
      title: "执行用时",
      dataIndex: ["judgeInfo", "time"],
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space size={4}>
          <ClockCircleOutlined style={{color: "#1677ff"}}/>
          <Text strong>{record?.judgeInfo?.time ?? "N/A"} ms</Text>
        </Space>
      ),
    },
    {
      title: "消耗内存",
      dataIndex: ["judgeInfo", "memory"],
      width: 140,
      align: "center",
      render: (_, record) => {
        const memory = record?.judgeInfo?.memory;
        const mb = memory ? (memory / (1024 * 1024)).toFixed(1) : "N/A";
        return (
          <Space size={4}>
            <BsCpu style={{color: "#1677ff"}}/>
            <Text strong>{mb} MB</Text>
          </Space>
        );
      },
    },
    {
      title: "判题信息",
      dataIndex: ["judgeInfo", "message"],
      width: 180,
      align: "left",
      ellipsis: true,
      render: (_, record) => (
        <Text type="secondary" ellipsis title={record?.judgeInfo?.message ?? "-"}>
          {record?.judgeInfo?.message ?? "-"}
        </Text>
      ),
    },
    {
      title: "题目",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<CodeOutlined/>}
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/question/submit/${formatId(record.questionId)}`);
          }}
        >
          查看题目
        </Button>
      ),
    },
    {
      title: "代码",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Popover
          placement="leftTop"
          title={
            <Space>
              <Text strong>提交代码</Text>
              <Tag color="blue" style={{borderRadius: 12}}>
                {record.language?.toUpperCase() || "-"}
              </Tag>
            </Space>
          }
          content={
            <div style={{maxWidth: 600, maxHeight: 400, overflow: "auto", padding: 8}}>
              {/* 可选：使用 react-syntax-highlighter 增强代码展示 */}
              {/* <SyntaxHighlighter language={record.language} style={a11yDark} wrapLines> */}
              {/*   {record.code || '(无代码)'} */}
              {/* </SyntaxHighlighter> */}
              <pre
                style={{margin: 0, fontSize: 12, lineHeight: 1.4, background: '#f5f5f5', padding: 12, borderRadius: 8}}>
                <code>{record.code || "(无代码)"}</code>
              </pre>
            </div>
          }
          trigger="click"
          overlayStyle={{maxWidth: 700}}
        >
          <Button size="small" type="primary" ghost>
            查看代码
          </Button>
        </Popover>
      ),
    },
    {
      title: "提交时间",
      key: "createTime",
      dataIndex: "createTime",
      width: 180,
      align: "center",
      sorter: true,
      render: (text) => (
        <Text type="secondary" style={{fontSize: 13}}>

          {formatDateTime(text)}
        </Text>
      ),
    },
  ];

  return (
    <PageContainer
      title="提交记录"
      subTitle="查看你的代码提交历史"
    >
      <ProCard
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{padding: 0}}
        bordered={false}
        hoverable
      >
        <ProTable<API.QuestionSubmitVO>
          headerTitle="提交记录"
          actionRef={actionRef}
          rowKey={(record) => formatId(record.id)}
          columns={columns}
          request={async (params, sort, filter) => {
            const resp = await listQuestionSubmitByPageUsingPost({
              current: params.current,
              pageSize: params.pageSize,
              language: languageFilter || undefined,
              status: statusFilter === -1 ? undefined : statusFilter,
              // @ts-ignore
              questionId: questionId,
              sortField: Object.keys(sort)?.[0] || "createTime",
              sortOrder: sort[Object.keys(sort)?.[0]]
                ? sort[Object.keys(sort)[0]] === "descend"
                  ? "desc"
                  : "asc"
                : "desc",
            });

            return {
              data: resp.data?.records || [],
              total: resp.data?.total || 0,
              success: true,
            };
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
          }}
          search={false}
          dateFormatter="string"
          options={{
            density: true,
            fullScreen: true,
            reload: true,
            setting: true,
          }}
          toolBarRender={() => [
            <Card
              key="filters"
              size="small"
              style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              bodyStyle={{padding: "12px 16px"}}
            >
              <Flex gap="middle" align="center" wrap>
                <Flex align="center" gap="small">
                  <FilterOutlined style={{color: "#1677ff", fontSize: 16}}/>
                  <Text strong style={{color: "#262626", fontSize: 14}}>
                    筛选：
                  </Text>
                </Flex>

                <Segmented
                  size="small"
                  options={LANGUAGE_OPTIONS}
                  value={languageFilter}
                  onChange={(value) => {
                    setLanguageFilter(value as string);
                    actionRef.current?.reload();
                  }}
                  style={{
                    background: "#fff",
                    border: "1px solid #d9d9d9",
                    borderRadius: 6,
                  }}
                />

                <Segmented
                  size="small"
                  options={STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value as number);
                    actionRef.current?.reload();
                  }}
                  style={{
                    background: "#fff",
                    border: "1px solid #d9d9d9",
                    borderRadius: 6,
                  }}
                />

                <Button
                  size="small"
                  type="text"
                  onClick={() => {
                    setLanguageFilter("");
                    setStatusFilter(-1);
                    actionRef.current?.reload();
                  }}
                  style={{color: "#8c8c8c", fontSize: 12}}
                >
                  重置
                </Button>
              </Flex>
            </Card>,
          ]}
          size="middle"
          scroll={{x: "max-content"}}
          tableStyle={{
            borderRadius: 12,
            background: "#fff",
          }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-even" : "table-row-odd"
          }
        />
      </ProCard>
    </PageContainer>
  );
};

export default ResultPage;
