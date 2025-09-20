// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 执行代码调试操作 POST /api/judge/inner/debug */
export async function debugUsingPost(
  body: API.DebugSubmitRequest,
  options?: { [key: string]: any }
) {
  return request<API.ExecuteCodeResponse>("/api/judge/inner/debug", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 执行判题操作 POST /api/judge/inner/do */
export async function doJudgeUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doJudgeUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.QuestionSubmit>("/api/judge/inner/do", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
