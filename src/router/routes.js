
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/students', name: 'students.index', component: () => import('src/components/students/StudentIndex.vue') },
      { path: '/students/create', name: 'students.create', component: () => import('src/components/students/StudentCreate.vue') },
      {
        path: '/students/:id/edit', name: 'students.edit',
        component: () => import('src/components/students/StudentEdit.vue'),
        props: true
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
