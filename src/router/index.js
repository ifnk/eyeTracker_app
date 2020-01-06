import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login' // 登录
import RegisterAccount from '../components/RegisterAccount' // 用户注册
import Home from '../components/Home' // 首页
import Welcome from '../components/Welcome' // 欢迎页
import Users from '../components/user/Users' //用户列表
import PersonConfig from '../components/user/PersonConfig' //配准
import Third from '../components/eye/Third'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    // 当地址 是login 的时候 ，通过组件login 来显示
    path: '/home', //先把home 组件 展示 出来 ，然后 在重定向 到 welcome
    component: Home,
    redirect: '/personConfig', //重定向
    //这是子路由
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/personConfig', component: PersonConfig }
    ]
  },
  {
    // 当地址 是login 的时候 ，通过组件login 来显示
    path: '/registerAccount',
    component: RegisterAccount
  },
  {
    // 当地址 是login 的时候 ，通过组件login 来显示
    path: '/login',
    component: Login
  },

  {
    // 当地址 是login 的时候 ，通过组件login 来显示
    path: '/third',
    component: Third
  }

]

const router = new VueRouter({
  routes
})
// 如果用户没有登录，但是直接 通过url访问 特定页面 ，需要重新导航到登录页面
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要 访问的路径
  //from 代表从哪个路径 跳转 而来
  //next 是一个函数 ，表示 放行
  // next() 放行  next('/login') 强制跳转

  //1.判断用户 访问的是不是登录页
  if (to.path === '/login') return next()//是登录页就 放行
  //不是登录页
  const tokenStr = window.sessionStorage.getItem('token')//获取一下token
  //如果 token 不存在 (没登录 )
  if (!tokenStr) return next('/login')//强制跳转 到 login 页面
  //有的话
  next() //放行
})

export default router
