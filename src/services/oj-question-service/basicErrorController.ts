// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** errorHtml GET /api/question/error */
export async function errorHtmlUsingGet(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/question/error", {
    method: "GET",
    ...(options || {}),
  });
}

/** errorHtml PUT /api/question/error */
export async function errorHtmlUsingPut(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/question/error", {
    method: "PUT",
    ...(options || {}),
  });
}

/** errorHtml POST /api/question/error */
export async function errorHtmlUsingPost(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/question/error", {
    method: "POST",
    ...(options || {}),
  });
}

/** errorHtml DELETE /api/question/error */
export async function errorHtmlUsingDelete(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/question/error", {
    method: "DELETE",
    ...(options || {}),
  });
}

/** errorHtml PATCH /api/question/error */
export async function errorHtmlUsingPatch(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/question/error", {
    method: "PATCH",
    ...(options || {}),
  });
}
