// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 创建题目 用户创建一个新的题目 POST /api/question/add */
export async function addQuestionUsingPost(
  body: API.QuestionAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/question/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除题目 根据题目ID删除指定题目 POST /api/question/delete */
export async function deleteQuestionUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/question/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑题目（用户） 用户编辑自己的题目 POST /api/question/edit */
export async function editQuestionUsingPost(
  body: API.QuestionUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/question/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据ID获取题目 根据题目ID获取题目的详细信息 GET /api/question/get */
export async function getQuestionByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.Question>("/api/question/get", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据ID获取题目信息 根据题目ID获取题目的详细信息 GET /api/question/get/vo */
export async function getQuestionVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseQuestionVO_>("/api/question/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页获取题目列表（仅管理员） 管理员根据查询条件分页获取题目列表 POST /api/question/list/page */
export async function listQuestionByPageUsingPost(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestion_>("/api/question/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取题目列表（封装类） 根据查询条件分页获取题目列表（封装类） POST /api/question/list/page/vo */
export async function listQuestionVoByPageUsingPost(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionVO_>(
    "/api/question/list/page/vo",
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

/** 分页获取题目（答题状态）列表（封装类） 根据查询条件分页获取题目（答题状态）列表（封装类） POST /api/question/list/page/vo/submit_status */
export async function listQuestionSubmitStatusVoByPageUsingPost(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionWithSubmitStatusVO_>(
    "/api/question/list/page/vo/submit_status",
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

/** 分页获取当前用户创建的资源列表 根据查询条件分页获取当前用户创建的题目列表 POST /api/question/my/list/page/vo */
export async function listMyQuestionVoByPageUsingPost(
  body: API.QuestionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestion_>(
    "/api/question/my/list/page/vo",
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

/** 案例调试 用户提交测试用例进行代码调试 POST /api/question/question_submit/debug */
export async function debugSubmitUsingPost(
  body: API.DebugSubmitRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>(
    "/api/question/question_submit/debug",
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

/** 提交题目 用户提交题目代码进行判题 POST /api/question/question_submit/do */
export async function doQuestionSubmitUsingPost(
  body: API.QuestionSubmitAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/question/question_submit/do", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取题目提交列表 分页获取题目提交列表（除了管理员外，普通用户只能看到非答案、提交代码等公开信息） POST /api/question/question_submit/list/page */
export async function listQuestionSubmitByPageUsingPost(
  body: API.QuestionSubmitQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionSubmitVO_>(
    "/api/question/question_submit/list/page",
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
