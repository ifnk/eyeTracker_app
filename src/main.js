import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import Common from './common/common'
import './common/miXin'

// eslint-disable-next-line no-unused-vars
// import _ from 'lodash' //lodash 是 js 的方法 库

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/css/global.css'

import axios from 'axios'

Vue.prototype.$myCommon = Common
// 配置aixos 请求 的根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:5000'
// 设置拦截器  当请求 除 登录 以外的 接口时，要验证你是不是登录 了，那就是要token 的
axios.interceptors.request.use(config => { //config就是请求对象 // console.log(config) // 给请求 头挂载 一 个 Authorization
  config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.toString() === 'Error: Network Error') {
      // Vue.prototype.$message.error('后台服务器没启动，请启动后台服务器！')
      Vue.prototype.$message({
        showClose: true,
        message: '后台服务器没启动，请启动后台服务器！',
        type: 'error',
        duration: 10000 // 这里显示10秒
      })
    }
    if (error.response) {
      if (error.response.status === 401) {
        // Vue.prototype.$message.error('登录密钥过期，请重新登录！')
        Vue.prototype.$confirm('登录密钥过期，请重新登录！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          router.push('/login')
        }).catch(() => {
          Vue.prototype.$message({
            type: 'error',
            message: '留在原网页'
          })
        })
      }
      if (error.response.status === 400) {
        Vue.prototype.$message({
          showClose: true,
          message: 'app发送到后台服务器的请求有错误！请检查！',
          type: 'error',
          duration: 10000 // 这里显示10秒
        })
      }
      if (error.response.status === 415) {
        Vue.prototype.$message({
          showClose: true,
          message: '传的参数媒体格式有问题！',
          type: 'error',
          duration: 10000 // 这里显示10秒
        })
      }
      return '' // 返回接口返回的错误信息
    }
  }
)

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
