import { Footer } from '@/components';
import { userLoginUsingPost, userRegisterUsingPost } from '@/services/oj/userController';
import { setToken } from '@/utils/auth';
import {
  AlipayCircleOutlined,
  LockOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Helmet, useModel } from '@umijs/max';
import { Alert, App, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const ActionIcons = () => {
  const { styles } = useStyles();
  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
    </>
  );
};
const Lang = () => {
  const { styles } = useStyles();
  return;
};
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleRegister = async (values: API.UserRegisterRequest) => {
    try {
      // 调用注册接口
      const response = await userRegisterUsingPost(values);
      if (response.code === 0) {
        message.success('注册成功！请登录');
        // 注册成功后自动切换到登录tab
        setType('account');
        // 清空表单
        return true;
      } else {
        message.error(response.message || '注册失败，请重试！');
        return false;
      }
    } catch (error) {
      message.error('注册失败，请重试！');
      return false;
    }
  };
  const handleLogin = async (values: API.UserLoginRequest) => {
    try {
      // 调用登录接口
      const response = await userLoginUsingPost(values);
      if (response.code === 0 && response.data) {
        const defaultLoginSuccessMessage = '登录成功！';
        const jwt_token = response.data.token;
        // 保存JWT token到localStorage
        if (jwt_token) {
          setToken(jwt_token);
        }
        message.success(defaultLoginSuccessMessage);
        // 保存用户信息到本地状态
        await fetchUserInfo();
        // 跳转到首页或指定页面
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
        return;
      } else {
        message.error(response.message || '登录失败，请重试！');
        return false;
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
      return false;
    }
  };
  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Yimohanser's OnlineJudge"
          subTitle="From 20250901"
          initialValues={{
            autoLogin: true,
          }}
          actions={['其他登录方式 :', <ActionIcons key="icons" />]}
          onFinish={async (values) => {
            if (type === 'account') {
              // 调用登录接口
              await handleLogin(values as API.UserLoginRequest);
            } else if (type === 'register') {
              // 调用注册接口
              await handleRegister(values);
            }
          }}
          submitter={{
            searchConfig: {
              submitText: type === 'account' ? '登录' : '注册',
            },
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
              {
                key: 'register',
                label: '用户注册',
              },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'错误的用户名和密码(admin/ant.design)'} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>
          )}
          {type === 'register' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入用户名"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder="请确认密码"
                rules={[
                  {
                    required: true,
                    message: '请确认密码！',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('userPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致!'));
                    },
                  }),
                ]}
              />
            </>
          )}

          {type === 'account' && (
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
            </div>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
