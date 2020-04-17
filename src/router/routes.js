
const routes = [
  {
    path: '',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '',
        name: 'index',
        meta: { auth: false },
        component: () => import('pages/Index.vue')
      },
      {
        path: '/logout',
        meta: { auth: true },
        name: 'logout',
        component: () => import('pages/Logout')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('pages/Register')
      },
      {
        path: '/user',
        meta: { auth: true },
        name: 'users',
        component: () => import('pages/Users')
      },
      {
        path: '/games',
        meta: { auth: true },
        name: 'user-games',
        component: () => import('pages/Game/Index.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/Game/Games.vue')
          },
          {
            path: 'edit/:id',
            component: () => import('pages/Game/Edit.vue')
          },
          {
            path: 'create',
            component: () => import('pages/Game/Create.vue')
          }
        ]
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
