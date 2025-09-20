// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** errorHtml GET /api/judge/error */
export async function errorHtmlUsingGet(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/judge/error", {
    method: "GET",
    ...(options || {}),
  });
}

/** errorHtml PUT /api/judge/error */
export async function errorHtmlUsingPut(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/judge/error", {
    method: "PUT",
    ...(options || {}),
  });
}

/** errorHtml POST /api/judge/error */
export async function errorHtmlUsingPost(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/judge/error", {
    method: "POST",
    ...(options || {}),
  });
}

/** errorHtml DELETE /api/judge/error */
export async function errorHtmlUsingDelete(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/judge/error", {
    method: "DELETE",
    ...(options || {}),
  });
}

/** errorHtml PATCH /api/judge/error */
export async function errorHtmlUsingPatch(options?: { [key: string]: any }) {
  return request<API.ModelAndView>("/api/judge/error", {
    method: "PATCH",
    ...(options || {}),
  });
}
