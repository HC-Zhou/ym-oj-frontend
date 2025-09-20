// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 根据ID获取题目 GET /api/question/inner/get/id */
export async function getQuestionByIdUsingGet1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionByIdUsingGET1Params,
  options?: { [key: string]: any }
) {
  return request<API.Question>("/api/question/inner/get/id", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据ID获取题目提交信息 GET /api/question/inner/question_submit/get/id */
export async function getQuestionSubmitByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionSubmitByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.QuestionSubmit>(
    "/api/question/inner/question_submit/get/id",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 更新题目提交信息 POST /api/question/inner/question_submit/update */
export async function updateQuestionSubmitUsingPost(
  body: API.QuestionSubmit,
  options?: { [key: string]: any }
) {
  return request<boolean>("/api/question/inner/question_submit/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新题目信息 POST /api/question/inner/question/update */
export async function updateQuestionUsingPost(
  body: API.Question,
  options?: { [key: string]: any }
) {
  return request<boolean>("/api/question/inner/question/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
