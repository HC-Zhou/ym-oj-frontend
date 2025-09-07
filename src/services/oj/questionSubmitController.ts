// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 提交题目 POST /api/question_submit/ */
export async function doQuestionSubmitUsingPost(
  body: API.QuestionSubmitAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/question_submit/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 案例调试 POST /api/question_submit/debug */
export async function debugSubmitUsingPost(
  body: API.DebugSubmitRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/question_submit/debug", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取题目提交列表 POST /api/question_submit/list/page */
export async function listQuestionSubmitByPageUsingPost(
  body: API.QuestionSubmitQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionSubmitVO_>(
    "/api/question_submit/list/page",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
