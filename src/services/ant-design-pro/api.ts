// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';


export async function currentUser(options?: { [key: string]: any }) {
  let currentUserData: API.CurrentUser | null = null;
  const rawUser = await request<API.BaseResponseLoginUserVO_>("/api/user/get/login", {
    method: "GET",
    ...(options || {}),
  });
  currentUserData = {
    name: rawUser.data?.userName || '请输入文本',
    avatar: rawUser.data?.userAvatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    // @ts-ignore
    userid: rawUser.data?.id,
    signature: rawUser.data?.userProfile,
    access: rawUser.data?.userRole,
  };
  if (!currentUserData) {
    return {
      success: false,
      data: null,
    }
  }
  return {
    success: true,
    data: currentUserData,
  };
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
