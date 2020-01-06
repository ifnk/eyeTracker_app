<template>
  <div>
    <!--这是列表-->
    <div class="personConfigList" v-if="pageType==='list'">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">个人管理</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">我的配准</a></el-breadcrumb-item>
      </el-breadcrumb>
      <!--编辑配准模态框-->
      <el-dialog
        title="编辑配准"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <!--内容主体区-->
        <el-form :model="editPersonConfigForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="配准名称" prop="name">
            <el-input v-model="editPersonConfigForm.name" placeholder="请输入配准名称"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editPersonConfigDo">确 定</el-button>
        </span>
      </el-dialog><!--添加配准模态框-->
      <el-dialog
        title="添加配准"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
      >
        <!--内容主体区-->
        <el-form :model="addPersonConfigForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="配准名称" prop="name">
            <el-input v-model="addPersonConfigForm.name" placeholder="请输入配准名称"></el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-tag class="personConfigTag" type="success">点击确定之前先按F11键将浏览器调至全屏</el-tag>
          <el-tag class="personConfigTag" type="success">然后在按ctrl+0将浏览器缩放重置</el-tag>
          <el-tag class="personConfigTag" type="success">配置过程中请勿刷新或关闭浏览器</el-tag>
        </div>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPersonConfig">确 定</el-button>
        </span>
      </el-dialog>
      <el-card>
        <!--搜索与添加区域-->
        <el-row
          :gutter="10"
        >
          <el-col :span="12">
            <div>
              <el-input
                clearable
                @clear="getPersonConfigList"
                v-model="queryInfo.key"
                placeholder="请输入配准名" class="input-with-select">
                <el-button slot="append" @click="getPersonConfigList" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <el-button
              @click="addDialogVisible=true"
              type="primary">添加配准
            </el-button>
            <el-button
              @click="testConfig()"
              type="success">测试当前配准效果
            </el-button>
          </el-col>
          <!--          <el-col :span="4">-->
          <!--            <el-button-->
          <!--              @click="activeCoorDinate()"-->
          <!--              type="danger">后端线程-->
          <!--            </el-button>-->
          <!--          </el-col>-->
        </el-row>
        <!--用户添加区域-->
        <div style="margin-top: 12px">
          <el-table border stripe :data="personConfigList" empty-text="您还没有配准，点击按钮添加配准">
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="配准名称" prop="name" min-width="80"></el-table-column>
            <el-table-column label="创建时间" prop="createTimeDto" min-width="95"></el-table-column>
            <el-table-column label="激活" prop="status" min-width="60">
              <template slot-scope="scope">
                <!--//插槽的优先级大于 prop -->
                <!--//scope.row 就 代表 这一行 的这个数据 -->
                <el-switch @change="personConfigStatusChanged(scope.row)" v-model="scope.row.status"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180">
              <template slot-scope="scope">
                <!--//通过 scope.row 获得 这一行对应 的数据 ，这样 就可以 比如 删除 之类 的 能拿到 要删除的 id 之类 的啦-->
                <!--                <el-button-->
                <!--                  @click="showEditDialog(scope.row.id)"-->
                <!--                  size="mini" type="primary" icon="el-icon-edit"/>-->
                <el-button
                  @click="removePersonConfgiById(scope.row)"
                  size="mini" type="danger" icon="el-icon-delete"/>

                <!--                &lt;!&ndash;//设置提示 (鼠标悬停) &ndash;&gt;-->
                <!--                <el-tooltip effect="dark" content="分配角色按钮" placement="top" :enterable="false">-->
                <!--                  <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>-->
                <!--                </el-tooltip>-->

              </template>

            </el-table-column>

          </el-table>

          <div style="margin-top: 15px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.PageIndex"
              :page-sizes="[1,2,4,10]"
              :page-size="queryInfo.PageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
    <!--这是配准页面-->
    <div class="father_second" v-if="pageType==='config'">
      <!--      <div class="txt_second">-->
      <!--        {{tips}}-->
      <!--      </div>-->
      <!--      <div class="point"  v-bind:style="{left:fix.x+'px',top:fix.y+'px'}"></div>-->
      <div class="Fixed"
           v-bind:style="{left:fix.x+'px',top:fix.y+'px'}">
        <div>{{countDown}}</div>
      </div>

      <div>
      </div>
    </div>
    <!--这是显示效果测试页-->
    <div class="testStyle" v-if="pageType==='test'" style="display: flex!important;
    padding-top: 20px;
    align-items: center!important;
    justify-content: flex-end!important;
    ">
      <!--      <el-button style="margin-right: 10px; " size="medium" type="info" @click="">改善校准效果</el-button>-->
      <el-button style="margin-right: 10px; " size="medium" type="info" @click="stopConfigTest">关闭</el-button>

      <div class="activeMouse" v-bind:style="{left:apiX+'px',top:apiY+'px'}">
        <!--这是 活动 的光标 -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PersonConfig',
  data () {
    return {
      isLoop: true, // 是否轮循
      countDown: 2,
      // 当前屏幕坐标
      screenSize: {
        width: 0,
        height: 0
      },
      /*
       * 当前页面类型
       * list :显示配准列表
       * test :测试效果页面
       * config :开始配准页面
       */
      pageType: 'list',
      //显示配准表
      editDialogVisible: false,
      addDialogVisible: false,
      editPersonConfigForm: { //添加用户 的表单数据 对象
        name: '',
        userId: ''
      },
      addPersonConfigForm: { //添加用户 的表单数据 对象
        name: '',
        userId: ''
      },
      editFormRules: {
        //名称验证规则
        name: [
          { required: true, message: '请输入配准名称', trigger: 'blur' },
          { min: 2, max: 10, message: '配准名称的长度在2-10个字符之间', trigger: 'blur' }
        ]
      },
      addFormRules: {
        //名称验证规则
        name: [
          { required: true, message: '请输入配准名称', trigger: 'blur' },
          { min: 2, max: 10, message: '配准名称的长度在2-10个字符之间', trigger: 'blur' }
        ]
      },

      total: 0, //列表总数
      // 用户配准列表
      personConfigList: [],

      //获取用户配准列表的参数
      queryInfo: {
        PageIndex: 1, //第几页
        PageSize: 10 //每页显示数量
      },
      //小圈是否 在大圈内
      isInDiv: false,
      tips: '请将目光移动至第 1 个圆点',
      windowHeight: `${document.documentElement.clientHeight}`,
      windowWidth: `${document.documentElement.offsetWidth}`,

      fix: { // 屏幕上的固定参照点
        x: 0,
        y: 0
      },
      seedCount: '', //这是 鼠标悬停方面 的东西
      clock: '', //这是 到计时 方面 的东西
      nowNum: 0, // 这是当前 第几个点
      mouseX: '',
      toouseY: '',
      apiX: 200,
      apiY: 200,
      msg: 'lala',
      second: 3
    }
  },

  mounted () {
  },
  created () {
    this.getPersonConfigList()
  },
  watch: {},
  mounted () {
    window.addEventListener('beforeunload', e => this.leaveCalibrationMode(e))
  },
  //离开页面 时 销毁 监听 函数
  destroyed: function () {
    window.removeEventListener('beforeunload', e => this.leaveCalibrationMode())
  },
  methods: {
    //向后台发送 退出 配准模式 的 请求
    async leaveCalibrationMode () {
      const { data: res } = await this.$http.get('api/personConfig/leaveCalibrationMode')
      if (!res.success) return this.$message.error(res.msg)
      this.$message.success(res.msg)
    },
    async stopConfigTest () {
      const { data: res } = await this.$http.get('api/personConfig/stopConfigTest')
      if (!res.success) return this.$message.error(res.msg)
      this.$emit('hideNav', false)
      this.$emit('changeMainBgc', false)
      this.$emit('changeMainImg', false)
      this.isLoop = false
      this.pageType = 'list'
      this.$message.success(res.msg)
    },
    async testConfig () {
      this.getScreenSize() // 先获取一下屏幕尺寸
      const { data: res } = await this.$http.post('api/personConfig/startConfigTest', this.screenSize)
      // console.log(res.msg)
      this.$emit('hideNav', true)
      this.$emit('changeMainBgc', true)
      this.$emit('changeMainImg', true)
      this.pageType = 'test'
      this.isLoop = true
      this.activeCoorDinate()
    },
    async editPersonConfigDo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('api/personConfig/edit/personConfigId/' + this.editPersonConfigForm.id, this.editPersonConfigForm)
        if (!res.success) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.editDialogVisible = false
        this.getPersonConfigList()
      })
    },
    async showEditDialog (personConfigId) {
      const { data: res } = await this.$http.get('api/personConfig/getOnePersonConfig/personConfigId/' + personConfigId)
      if (!res.success) return this.$message.error(res.msg)
      this.editPersonConfigForm = res.data
      // this.$message.success(res.msg)
      this.editDialogVisible = true
    },
    async removePersonConfgiById (personConfig) {
      if (personConfig.status) return this.$message.error('不能删除已激活的配准！')
      const confirmRes = await this.$confirm('确定要永久删除该配准么？', '提示',
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
      // console.log('确定')
      const { data: res } = await this.$http.delete('api/personConfig/delete/personConfigId/' + personConfig.id)
      if (res.status !== 200) return this.$message.error(res.msg)

      this.$message.success(res.msg)
      this.getPersonConfigList()
    },
    getScreenSize: function () {
      this.screenSize.width = window.screen.width
      this.screenSize.height = window.screen.height
    },
    //点击 确定 按钮调用
    addPersonConfig () {
      // 添加 用户 之前 先进行 表单校验
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        //如果校验失败 ,直接 return 不走下面的步骤 了
        if (!valid) {
          return
        }
        // 获取屏幕 宽高 尺寸
        const userId = window.sessionStorage.getItem('userId')
        this.getScreenSize()
        // if (!this.$myCommon.isFullscreen()) return this.$message.error('请按f11进入全屏！')
        // this.$message.success(this.screenSize.height)
        const { data: res } = await this.$http.post('api/personConfig/startConfig?name=' + this.addPersonConfigForm.name, this.screenSize)
        if (res.status !== 200) return this.$message.error(res.msg)
        // 先给固定参照点赋值
        // console.log(res)
        // 没有问题 就开始 轮询
        // console.log(this.apiX + '-' + this.apiY)
        this.$emit('changeMainImg', false)
        this.$emit('hideNav', true)
        this.$emit('changeMainBgc', true)
        this.pageType = 'config'
        // this.activeCoorDinate()
        // 在这之前关闭所有 的 配准
        this.closePersonConfig()
        // 并且开始 第一 次配准
        this.activeFirstConfig(userId, this.addPersonConfigForm.name)
      })
    },
    async closePersonConfig () {
      const { data: res } = await this.$http.put('api/personConfig/closePersonConfig')
      if (!res) return this.$message.error(res.msg)
    },
    // 第一次配准 (循环 )
    async activeFirstConfig (userId, name) {
      let that = this
      var timer
      this.$http.get('api/personConfig/firstConfig?userId=' + userId + '&name=' + name)
        .then(function (res) {
          if (!res.data.success) {
            // that.$message.error(res.data.msg)
            // console.log(res.data.countDown);
            that.fix.x = res.data.fixPoint.fixedX
            that.fix.y = res.data.fixPoint.fixedY
            // console.log(res.data.fixPoint)
            // console.log(that.fix.x + ',' + that.fix.y)
            that.countDown = res.data.countDown.toFixed(1)
            timer = setTimeout(() => {
              that.activeFirstConfig(userId, name)
            }, 50)
          } else {
            // that.$message.success(res.data.frequency)
            if (res.data.frequency >= 6) {
              clearTimeout(timer) //清理定时任务
              that.$message.success(res.data.msg)
              that.getPersonConfigList() //获取配准列表
              that.$emit('hideNav', false)
              that.$emit('changeMainBgc', false)
              that.$emit('changeMainImg', false)
              that.pageType = 'list'
              that.addDialogVisible = false
            } else {
              that.$message.success(res.data.msg)
              // console.log(res.data);
              timer = setTimeout(() => {
                that.activeFirstConfig(userId, name)
              }, 50)
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    activeCoorDinate () {
      let that = this
      let timer
      this.$http.get('api/personConfig/returnCoordinate')
        .then(function (res) {
          if (res && that.isLoop) {
            that.apiX = res.data.x
            that.apiY = res.data.y
            console.log(that.apiX + ',' + that.apiY)
            timer = setTimeout(() => {
              that.activeCoorDinate()
            }, 50)
          } else {
            clearTimeout(timer) //清理定时任务
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    //当模态框关闭后 的函数
    editDialogClose () {
      this.$refs.editFormRef.resetFields() //调用 表单引用 的 resetFields 函数 直接 重置 整个表单
    },
    //当模态框关闭后 的函数
    addDialogClose () {
      this.$refs.addFormRef.resetFields() //调用 表单引用 的 resetFields 函数 直接 重置 整个表单
    },

    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.queryInfo.PageSize = val
      this.getPersonConfigList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.queryInfo.PageIndex = val
      this.getPersonConfigList()
    },
    async personConfigStatusChanged (onePersonConfig) {
      // console.log(onePersonConfig.status)
      const userId = window.sessionStorage.getItem('userId')
      const { data: res } = await this.$http.put('api/personConfig/changePersonConfigStatus/userId/' + userId + '/personConfigId/' + onePersonConfig.id + '/status/' + onePersonConfig.status)
      // console.log(res.msg)
      if (res.status !== 200) {
        //失败了 应该 在把界面 改回去
        onePersonConfig.status = !onePersonConfig.status
        return this.$message.error(res.msg)
      }
      this.getPersonConfigList()
      return this.$message.success(res.msg)
    },
    async getPersonConfigList () {
      const userId = window.sessionStorage.getItem('userId')
      const { data: res } = await this.$http.post('api/personConfig/personConfigs/userId/' + userId, this.queryInfo)
      // console.log(res)
      if (!res.success) return this.$message.error(res.msg)
      // console.log(res)
      this.personConfigList = res.response.personConfigsResource
      this.total = res.response.totalItemsCount
      // console.log(this.total);
      // console.log(this.personConfigList[0])
    },
    async addMethod () {
      this.addPersonConfigForm.userId = window.sessionStorage.getItem('userId')
      const { data: res } = await this.$http.post('api/personConfig/add', this.addPersonConfigForm)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.$emit('hideNav', false)
      this.$emit('changeMainBgc', false)
      this.pageType = true
      this.addDialogVisible = false
      this.getPersonConfigList()
      this.$message.success(res.msg)
    },
  }
}
</script>

<style lang="less" scoped>
  .personConfigTag {
    margin-bottom: 10px;
    margin-right: 10px;
    font-size: 14px;
  }

  .startConfig {
    background-color: #000;
    width: 100%;
    height: 100%;
  }

  .nav-item {
    width: 40px;
    height: 40px;
    background-color: #f1f1f1;
    color: #333333;
  }

  .itemHover {
    background-color: #0190fe !important;
    color: #ffffff !important;
  }

  .txt_second {
    color: white;
    font-size: 35px;
    left: 50%;
    transform: translate(-50%, 10%);
    position: absolute;
  }

  .testStyle {

  }

  .father_second {
    background-color: #2a2a2a !important;
    height: 100%;
    width: 100%;
    position: relative;
  }

  .point {
    width: 10px;
    height: 10px;
    background-color: red;
    position: absolute;
  }

  .Fixed {
    width: 60px;
    height: 60px;
    border: 1px solid #c4c4c4;
    box-shadow: 0px 1px 4px #c4c4c4;
    transform: translate(-50%, -50%);
    border-radius: 100px;
    position: absolute;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    color: white;
    font-size: 20px;
  }

  .activeMouse:before {
    background-color: #fff;
    border-radius: 50%;
    content: "";
    display: block;
    opacity: 0.5;
    position: absolute;
    top: 0.75em;
    left: 0.75em;
    width: 1em;
    height: 0.5em;
    transform: rotate(-45deg);
  }

  .activeMouse {
    width: 50px;
    height: 50px;
    /*border: 1px solid #c4c4c4;*/
    box-shadow: 0 0 0 0.1em #0cf inset, 0 0 1em #0cf inset;
    border-radius: 30px;
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    color: white;
    font-size: 8px;
  }
</style>
