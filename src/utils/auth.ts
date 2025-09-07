/**
 * JWT Token 管理工具
 */

const TOKEN_KEY = 'access_token';

/**
 * 保存JWT token到localStorage
 * @param token JWT token字符串
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 从localStorage获取JWT token
 * @returns JWT token字符串或null
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 从localStorage移除JWT token
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 检查是否有有效的JWT token
 * @returns 是否有token
 */
export const hasToken = (): boolean => {
  return !!getToken();
};

/**
 * 清除所有认证相关的数据
 */
export const clearAuth = (): void => {
  removeToken();
  // 可以在这里添加其他需要清理的认证数据
};

/**
 * 处理401未授权错误
 */
export const handleUnauthorized = (): void => {
  // 清除过期的token
  clearAuth();
  
  // 跳转到登录页面
  if (window.location.pathname !== '/user/login') {
    window.location.href = '/user/login';
  }
};

/**
 * 用户登出
 */
export const logout = (): void => {
  // 清除认证数据
  clearAuth();
  
  // 跳转到登录页面
  window.location.href = '/user/login';
};
