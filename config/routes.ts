export default [
  {
    path: '/user',
    layout: false,
    routes: [{name: '登录', path: '/user/login', component: './user/login'}],
  },
  {
    path: '/question',
    icon: 'table',
    name: '题库',
    routes: [
      {path: '/question', redirect: '/question/index'},
      {component: './question', path: '/question/index', name: "浏览题目"},
      {component: './question/edit', path: '/question/edit', name: "题目管理"},
      {component: './question/edit/detail', path: '/question/edit/:id', name: "编辑题目", hideInMenu: true},
      {component: './question/submit', path: '/question/submit/:id', name: "提交题目", hideInMenu: true},
      {component: './question/submit/result', path: '/question/submit/result', name: "提交结果"},
    ],
  },
  {path: '/', redirect: '/question'},
  {path: '*', layout: false, component: './404'},
];
