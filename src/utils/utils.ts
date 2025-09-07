/**
 * Question页面相关的工具函数
 * 统一处理大数ID溢出问题和日期格式化
 */

/**
 * 处理大数ID溢出问题
 * 当ID超过JavaScript安全整数范围时，转换为字符串处理
 * @param id - 需要处理的ID值
 * @returns 格式化后的ID字符串或原值
 */
export const formatId = (id: any): string | number => {
  if (id === undefined || id === null) return "-";
  
  // 如果ID是字符串且长度超过15位，直接返回
  if (typeof id === 'string' && id.length > 15) {
    return id;
  }
  
  // 如果ID是数字且超过JavaScript安全整数范围，转换为字符串
  if (typeof id === 'number' && id > Number.MAX_SAFE_INTEGER) {
    return id.toString();
  }
  
  return id;
};

/**
 * 格式化中文日期时间
 * 统一处理时间戳转换为中文格式的日期时间字符串
 * @param input - 时间戳（数字或字符串）
 * @param includeSeconds - 是否包含秒数，默认false
 * @returns 格式化后的中文日期时间字符串
 */
export const formatChineseDate = (
  input?: number | string, 
  includeSeconds: boolean = false
): string => {
  if (input === undefined || input === null) return "";
  
  let ts: number | undefined;
  if (typeof input === "number") {
    ts = input;
  } else if (typeof input === "string") {
    const n = Number(input);
    ts = Number.isNaN(n) ? undefined : n;
  }
  
  if (!ts) return "";
  
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return "";
  
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Shanghai",
  };
  
  if (includeSeconds) {
    options.second = "2-digit";
  }
  
  return new Intl.DateTimeFormat("zh-CN", options).format(date);
};

/**
 * 格式化日期时间（带秒）
 * 专门用于需要显示秒数的场景
 * @param timestamp - 时间戳
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (timestamp: React.ReactNode): string => {
  if (!timestamp) return "-";
  
  try {
    // @ts-ignore
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "-";
    
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  } catch {
    return "-";
  }
};

/**
 * 安全地处理API调用中的ID参数
 * 确保传递给API的ID参数不会因为大数溢出导致问题
 * @param id - 原始ID值
 * @returns 安全的ID值
 */
export const safeApiId = (id: any): any => {
  if (id === undefined || id === null) return id;
  
  // 对于API调用，如果ID是字符串且为纯数字，保持字符串格式
  if (typeof id === 'string' && /^\d+$/.test(id)) {
    return id;
  }
  
  // 如果ID是数字且超过安全范围，转换为字符串
  if (typeof id === 'number' && id > Number.MAX_SAFE_INTEGER) {
    return id.toString();
  }
  
  return id;
};

/**
 * 解析标签字符串
 * 统一处理从API返回的标签数据
 * @param tags - 标签字符串或数组
 * @returns 解析后的标签数组
 */
export const parseTags = (tags?: string | string[]): string[] => {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags.filter((tag) => typeof tag === 'string' && tag.trim());
  }
  
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        return parsed.filter((tag) => typeof tag === 'string' && tag.trim());
      }
    } catch (e) {
      // 如果JSON解析失败，按逗号分割
      return tags.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  
  return [];
};

/**
 * 解析判题配置
 * 统一处理从API返回的判题配置数据
 * @param config - 判题配置字符串或对象
 * @returns 解析后的判题配置对象
 */
export const parseJudgeConfig = (
  config?: string | API.JudgeConfig
): API.JudgeConfig | undefined => {
  if (!config) return undefined;
  
  if (typeof config !== 'string') return config;
  
  try {
    const obj = JSON.parse(config);
    return {
      timeLimit: typeof obj?.timeLimit === 'number' ? obj.timeLimit : undefined,
      memoryLimit: typeof obj?.memoryLimit === 'number' ? obj.memoryLimit : undefined,
      stackLimit: typeof obj?.stackLimit === 'number' ? obj.stackLimit : undefined,
    };
  } catch (e) {
    return undefined;
  }
};

/**
 * 解析判题用例
 * 统一处理从API返回的判题用例数据
 * @param cases - 判题用例数据
 * @returns 解析后的判题用例数组
 */
export const parseJudgeCases = (cases?: unknown): API.JudgeCase[] => {
  if (!cases) return [];
  
  try {
    if (typeof cases === 'string') {
      const arr = JSON.parse(cases);
      return Array.isArray(arr)
        ? arr.map((x) => ({
            input: (x as any)?.input ?? '',
            output: (x as any)?.output ?? '',
          }))
        : [];
    }
    
    if (Array.isArray(cases)) {
      return (cases as any[]).map((x) => ({
        input: (x as any)?.input ?? '',
        output: (x as any)?.output ?? '',
      }));
    }
  } catch (e) {
    return [];
  }
  
  return [];
};
