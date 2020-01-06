<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <!--      <div class="avatar_box">-->
      <!--        <img src="../assets/logo.png" alt="">-->
      <!--      </div>-->
      <!--登录表单区域-->
      <!--为el-form 加上数据绑定-->
      <!--ref 引用 获取到ref 就能拿到这个表单的实例对象-->
      <el-form ref="registerFormRef" :rules="registerFormRules" label-width="0px" :model="registerForm"
               class="login_form">
        <!--用户名-->
        <el-form-item prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入注册用户姓名" prefix-icon="iconfont icon-user"/>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入注册用户密码"
            prefix-icon="iconfont icon-3702mima"
          />
        </el-form-item>

        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="warning" @click="returnToLogin">返回</el-button>
          <el-button type="primary" @click="registerAccount">添加用户</el-button>
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
  name: 'RegisterAccount',

  mounted () {
    // window.setInterval(() => {
    //   setTimeout(this.Test(), 0)
    // }, 100)
  },
  methods: {
    //点击 重置按钮，重置登录表单
    returnToLogin () {
      this.$message.success('登录页面')
      this.$router.push('login')//页面 跳转
    },
    resetLoginForm () {
      //这里的this 就是 指当前 这个组件实例对象(因为在表单上面加了ref )
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    //点击登录按钮事件
    registerAccount () {
      // ()=> 这个是 匿名 的回调函数
      //步骤 1 先获取 表单的引用 对象  loginFormRef
      //步骤 2 引用对象 调用 validate 函数  进行 表单的校验
      //步骤 3  .validate 接受一个回调函数  valid 是 验证结果 （bool ） 判断 bool
      // 就知道表单是验证通过了还是没有通过
      this.$refs.registerFormRef.validate(async valid => {
        // console.log(valid)
        // return console.log(this.registerForm)
        if (!valid) return //如果 验证不通过 直接  return
        const { data: res } = await this.$http.post('api/user/addUser', this.registerForm)
        if (!res.success) return this.$message.error(res.msg)
        this.$message.success(res.msg + ' 请登录！')
        this.$router.push('login')//页面 跳转
      })
    }
  },
  data () {
    return {
      //这是登录表单的数据绑定对象
      registerForm: {
        name: '',
        password: ''
      },
      //这是表单的验证规则对象
      registerFormRules: {
        //验证用户名是否合法
        name: [
          //trigger 出发实机,当文本框失去焦点的时候 触发
          { required: true, message: '请输入注册用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度在2到10个字符之间 ' }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入注册用户密码', trigger: 'blur' },
          { min: 2, message: '密码长度不能小于2位' }
        ]
      }

    }
  }
}
</script>

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
