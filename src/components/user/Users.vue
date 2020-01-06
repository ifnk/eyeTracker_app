<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片试图区域-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <div>
            <el-input
              clearable
              @clear="getUserList"
              v-model="queryInfo.key"
              placeholder="请输入用户名或手机号" class="input-with-select">
              <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <el-button
            @click="addDialogVisible=true"
            type="primary">添加用户
          </el-button>
        </el-col>
      </el-row>
      <!--用户添加区域-->
      <div style="margin-top: 12px">
        <el-table border stripe :data="userlist.users">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="姓名" prop="name" min-width="80"></el-table-column>
          <el-table-column label="电话" prop="mobile" min-width="120"></el-table-column>
          <el-table-column label="角色" prop="roleName" min-width="80"></el-table-column>
          <el-table-column label="状态" prop="status" min-width="60">
            <template slot-scope="scope">
              <!--//插槽的优先级大于 prop -->
              <!--//scope.row 就 代表 这一行 的这个数据 -->
              <el-switch @change="userStateChanged(scope.row)" v-model="scope.row.status"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180">
            <template slot-scope="scope">
              <!--//通过 scope.row 获得 这一行对应 的数据 ，这样 就可以 比如 删除 之类 的 能拿到 要删除的 id 之类 的啦-->
              <el-button
                @click="showEditDialog(scope.row.id)"
                size="mini" type="primary" icon="el-icon-edit"></el-button>
              <el-button
                @click="removeUserById(scope.row.id)"
                size="mini" type="danger" icon="el-icon-delete"></el-button>

              <!--//设置提示 (鼠标悬停) -->
              <el-tooltip effect="dark" content="分配角色按钮" placement="top" :enterable="false">
                <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
              </el-tooltip>

            </template>

          </el-table-column>

        </el-table>

        <div style="margin-top: 15px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.PageIndex"
            :page-sizes="[1,2,4]"
            :page-size="queryInfo.PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <!--添加用户模态框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!--内容主体区-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑 用户模态框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible"
               width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules"
               label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'Users',
  data () {
    //自定义手机号验证规则
    var checkMobile = (rule, value, cb) => {
      //验证手机好的 正则 表达 式
      const regMobile = /^(0|86|17951)?(13[0-9]15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        //合法的手机号
        return cb()
      }
      //如果验证不通过
      cb(new Error('手机号格式不正确！'))
    }
    return {
      //修改表单的验证规则对象
      editFormRules: {
        //名称验证规则
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名的长度在2-10个字符之间', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 2, max: 15, message: '手机号的长度在2-10个字符之间', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //添加表单的验证规则对象
      addFormRules: {
        //名称验证规则
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名的长度在2-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 15, message: '密码的长度在2-10个字符之间', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 2, max: 15, message: '手机号的长度在2-10个字符之间', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addForm: { //添加用户 的表单数据 对象
        mobile: '',
        name: '',
        password: ''
      },
      addDialogVisible: false, //控制添加用户对话框是否隐藏
      editDialogVisible: false, //控制编辑用户对话框是否隐藏
      editForm: {}, //单个 查询 到 的 用户 信息 （是个对象 ）
      //获取用户列表的参数
      queryInfo: {
        PageIndex: 1, //第几页
        PageSize: 4 //每页显示数量
      },
      total: 0,
      userlist: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    //根据 id 删除 用户
    async removeUserById (id) {
      //弹框询问 用户 是否 删除 数据
      const confirmRes = await this.$confirm('确定要永久删除该用户么？', '提示',
        {
          confirmButtonText: '确定', //用户确认删除 ，返回字符串为 confirm
          cancelButtonText: '取消', //用户取消 删除 ，返回字符串为 cancel
          type: 'warning'
        }).catch(err => { // Catch 捕获 取消 这个 按钮
        return err
      })
      // 用户点击 了取消
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消')
      }
      //用户点击  了 确定
      // console.log('确认删除')
      const { data: res } = await this.$http.delete('api/user/deleteUser/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    //修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.put('api/user/editUser/userId/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) {
          //失败了 应该 在把界面 改回去
          return this.$message.error(res.meta.msg)
        }
        //关闭对话框
        this.editDialogVisible = false
        //刷新  表格
        this.getUserList()
        //提示修改成功
        return this.$message.success(res.meta.msg)
      })
    },
    //监听 修改 用户 对话框 的关闭
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    //展示用户编辑的 模态框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('api/user/oneUser/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.message.error(res.meta.msg)
      }
      this.editForm = res.data.user
      this.editDialogVisible = true
    },
    //当模态框关闭后 的函数
    addDialogClose () {
      this.$refs.addFormRef.resetFields() //调用 表单引用 的 resetFields 函数 直接 重置 整个表单
    },
    //监听 用户 状态 switch 开关 的改变
    async userStateChanged (userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(`api/user/userId/${userInfo.id}/status/${userInfo.status}`)
      // console.log(res.meta.msg)
      if (res.meta.status !== 200) {
        //失败了 应该 在把界面 改回去
        userInfo.status = !userInfo.status
        return this.$message.error(res.meta.msg)
      }
      return this.$message.success(res.meta.msg)
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.queryInfo.PageSize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.queryInfo.PageIndex = val
      this.getUserList()
    },
    async getUserList () {
      const { data: res } = await this.$http.post('api/user/users', this.queryInfo)
      this.userlist = res.data
      this.total = res.data.totalItemsCount
      // console.log(res.data)
    },
    //点击按钮添加新用户
    addUser () {
      // 添加 用户 之前 先进行 表单校验
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) { //如果校验失败 ,直接 return 不走下面的步骤 了
          return
        }
        //校验通过 可以 发起真正的校验请求
        const { data: res } = await this.$http.post('api/user/addUser', this.addForm)
        console.log(res)
        if (!res.success) {
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        //添加成功隐藏模态框
        this.addDialogVisible = false
        //然后 在重新 加载 用户 列表
        this.getUserList()
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
