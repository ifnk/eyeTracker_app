<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/eye.png" alt="">
      </div>
      <!--登录表单区域-->
      <!--为el-form 加上数据绑定-->
      <!--ref 引用 获取到ref 就能拿到这个表单的实例对象-->
      <el-form ref="loginFormRef" :rules="loginFormRules" label-width="0px" :model="loginForm" class="login_form">
        <!--用户名-->
        <el-form-item prop="name">
          <el-input v-model="loginForm.name" placeholder="请输入姓名" prefix-icon="iconfont icon-user"/>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
          />
        </el-form-item>

        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="success" @click="registerAccount">注册</el-button>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  mounted () {
    // window.setInterval(() => {
    //   setTimeout(this.Test(), 0)
    // }, 100)
  },
  methods: {
    //点击 重置按钮，重置登录表单
    registerAccount () {
      this.$message.success('注册用户界面')
      this.$router.push('registerAccount')//页面 跳转
    },
    resetLoginForm () {
      //这里的this 就是 指当前 这个组件实例对象(因为在表单上面加了ref )
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    //点击登录按钮事件
    login () {
      // ()=> 这个是 匿名 的回调函数
      //步骤 1 先获取 表单的引用 对象  loginFormRef
      //步骤 2 引用对象 调用 validate 函数  进行 表单的校验
      //步骤 3  .validate 接受一个回调函数  valid 是 验证结果 （bool ） 判断 bool
      // 就知道表单是验证通过了还是没有通过
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return //如果 验证不通过 直接  return
        const { data: res } = await this.$http.post('api/user/login', this.loginForm)
        // const res = await this.$http.post('login', this.loginForm)
        // console.log(res)
        //判断下状态码
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        //localStorage 是 持久化 的存储 机制  sessionStorage 是 会话 旗舰  的存储 机制
        //1.将登录成功后的 token ，保存 到客户 端的 sessionStorage里面
        //1.1 项目中出了登录之外的其他 api 接口， 必须在登录之后才能访问
        //1.2 token 只应该在当前 网站 打开旗舰 生效 ，所以将 token 保存在 sessionStorage里面
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)//保存token
        window.sessionStorage.setItem('userId', res.data.userInfo.id)//保存 userId
        window.sessionStorage.setItem('userName', res.data.userInfo.name)//保存 userId
        //2. 通过编程式导航  跳转 到后台主页 ，路由 地址 是 /home
        // this.$router.push('/first')//页面 跳转
        this.$router.push('home')//页面 跳转
      })
    },
    async Test () {

      const { data: res } = await this.$http.post('api/personConfig/test')
      console.log(res.data)
    }
  },
  data () {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        name: '',
        password: ''
      },
      //这是表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        name: [
          //trigger 出发实机,当文本框失去焦点的时候 触发
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度在2到10个字符之间 ' }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, message: '密码长度不能小于2位' }
        ]
      }

    }
  }
}
</script>

<!--这个节点中支持less语法格式 scope 控制样式生效区间  加上scope 这个样式 只在当前组件内生效  -->
<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: relative;

    .avatar_box {
      height: 130px;
      width: 130px;
      border-radius: 80px;
      background-color: #fff;
      border: 1px solid #eee;
      position: absolute;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 0 10px #ddd;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        background-color: #eee;
        height: 90%;
        width: 90%;
        border-radius: 80px;
        box-shadow: 0px 1px 3px #eee;

      }
    }

    .btns {
      display: flex !important;
      justify-content: flex-end !important;
    }

    .login_form {
      width: 100%;
      padding-top: 100px;
      padding-right: 20px;
      padding-left: 20px;
      box-sizing: border-box;
      justify-content: center !important;
    }
  }

</style>
