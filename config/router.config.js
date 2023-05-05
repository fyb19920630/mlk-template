const router = [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user/login',
            name: '登录',
            icon: 'smile',
            component: './user/login',
          },
          {
            path: '/user/register',
            name: '注册',
            icon: 'smile',
            component: './user/register',
          },
          {
            path: '/user/check',
            name: '审核',
            icon: 'smile',
            component: './user/check',
          },
          {
            path: '/user',
            redirect: '/user/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            Routes: ['src/pages/Authorized'],
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/home',
                name: '首页',
                icon: 'home',
                component: './home',
              },
              {
                path: '/',
                redirect: '/home',
              },
            ],
          },
          {
            component: './404',
          },
          {
            path: '/',
            redirect: '/home',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
];
export default router;
