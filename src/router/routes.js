import components from "./components"

const exampleRouter = [];

// 路由自动注册
const req = require.context('@/example', false, /\.vue$/)
req.keys().forEach(fileName => {
  const reg = /^\.\/(.+)\.vue$/.exec(fileName)
  const title = req(fileName).default.name
  title && exampleRouter.push({
    path: reg[1],
    name: reg[1],
    component: () => import(`@/example/${reg[1]}`),
    meta: {
      title
    }
  })
})

// console.log(exampleRouter);

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: components.layout,
    children: [
      {
        path: '/index',
        redirect: '/example'
      },
      {
        path: '/example',
        name: 'example',
        component: components.example,
        children: [
          {
            path: '/example',
            redirect: '/example/menu-list'
          },
          ...exampleRouter
        ]
      },
    ]
  },
]


export default routes