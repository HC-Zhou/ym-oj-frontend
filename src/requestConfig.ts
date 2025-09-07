import {BACKEND_HOST_LOCAL, BACKEND_HOST_PROD} from '@/constants';
import type {RequestConfig, RequestOptions} from '@@/plugin-request/request';
import {getToken, handleUnauthorized} from '@/utils/auth';
import {message} from 'antd';
// @ts-ignore
import JSONBig from 'json-bigint';

const isDev = process.env.NODE_ENV === 'development';

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  baseURL: isDev ? BACKEND_HOST_LOCAL : BACKEND_HOST_PROD,
  withCredentials: true,
  // 使用 json-bigint 无损解析后端返回中的长整型 ID
  transformResponse: [(data: any) => {
    try {
      if (typeof data === 'string' && data) {
        return JSONBig({ storeAsString: true }).parse(data);
      }
    } catch (e) {
      // ignore
    }
    return data;
  }],

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 获取accessToken
      const accessToken = getToken();
      if (accessToken) {
        // 添加Authorization头
        config.headers = {
          ...config.headers,
          Authorization: `${accessToken}`,
        };
      }
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 处理成功响应
      return response;
    },
  ],

  // 错误处理配置
  errorConfig: {
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 检查是否是401未授权错误
      if (error.response && error.response.status === 401) {
        // 显示提示信息
        message.error('登录已过期，请重新登录');
        // 调用auth工具中的处理函数，清除token并跳转登录页
        handleUnauthorized();
        return;
      }
      // 对于其他错误，显示通用错误信息
      if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`请求失败: ${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        message.error('网络请求失败，请检查网络连接');
      } else {
        // 发送请求时出了点问题
        message.error('请求错误，请重试');
      }
    },
  },
};
