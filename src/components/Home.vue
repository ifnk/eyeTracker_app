<template>
  <el-container class="home-container">
    <el-header :height="headerHeight+'px'">
      <div class="header_cl">
        <img src="../assets/eye.png">
        <span>眼动仪后台管理系统</span>
      </div>
      <div>
        <div style="padding-right: 10px;font-size: 15px;">当前用户：{{userName}}</div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!--左边侧边栏-->
      <el-aside :width="isCollapse? '0px':'200px'">
        <!--按钮条，控制左侧菜单折叠与展开-->
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单区-->
        <el-menu
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <!--一级菜单-->
          <el-submenu :index="item.Id+''" v-for="item in menuList" :key="item.Id">
            <!--一级菜单模板区-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.Id]"></i>
              <!--文本-->
              <span>{{item.PsName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="'/'+subItem.PsC" v-for="subItem in  item.SubMenus"
              :key="subItem.Id"
              @click="saveNavState('/'+subItem.PsC)"
            >
              <i class="el-icon-menu"></i>
              <span>{{subItem.PsName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main :class="{bgcIsGree:isBgcStyleActive,hasBgImg:isBgImgActive}">
        <!--这里放一个路由的占位符-->
        <router-view @hideNav="hideNav" @changeMainImg="changeMainImg" @changeMainBgc="changeMainBgc"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      userName: '',
      isBgcStyleActive: false,
      isBgImgActive: false,
      headerHeight: 60,
      //菜单列表
      menuList: [],
      //默认激活的 一级菜单
      activePath: '',
      //字体图标列表
      iconsObj: {
        '100': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false//左侧菜单栏是否折叠
    }
  },
  created () { //当 组建 被创建 时的 生命周期函数
    //获取所以的左侧菜单
    this.getMenuList()
    //从session 中取 出 激活 的 菜单名称 赋值 给 actionPath ,这样刷新 也能 看到 之前激活的 栏了
    this.activePath = window.sessionStorage.getItem('activePath')
    this.userName = window.sessionStorage.getItem('userName')
  },
  methods: {
    //背景图
    changeMainImg (bool) {
      if (bool) {
        this.isBgImgActive = true
      } else {
        this.isBgImgActive = false
      }
    },
    //隐藏导航栏
    hideNav (bool) {
      if (bool) {
        this.headerHeight = 0
        this.isCollapse = true
      } else {
        this.headerHeight = 60
        this.isCollapse = false
      }
    },
    //更改背景颜色
    changeMainBgc (bool) {
      if (bool) {
        this.isBgcStyleActive = true
      } else {
        this.isBgcStyleActive = false
      }
    },
    //保存链接的激活状态
    saveNavState (activePath) {
      //保存 当前 的激活  链接  这样 刷新 网页 的时候  ，也是激活 的
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath // 菜单列表状态 高亮保持(保持激活状态)
    },
    //登出功能
    logout () {
      //基于 token 的方式  实现退 出 比较 简单，只需要 销毁本地的 token 即可 ，这样，
      // 后续的请求 就不会携带token ,必须重新登录 生成 一个token 之后才可以访问 页面
      window.sessionStorage.clear() //清空 token

      this.$message.success('退出登录成功！')//弹框提示 下……
      this.$router.push('/login')
    },
    //获取所有的左测菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('api/mainMenu/mainMenus') //向后端发送请求
      // console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)//如果没有请求 到数据 报错
      this.menuList = res.data //请求 到 了 就 赋值
      // console.log(res)
    },
    //点击按钮 切换 菜单 的折叠 与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }

  }

}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding-left: 10px;
    color: #fff;
    font-size: 20px;

    div {
      display: flex !important;
      align-items: center !important;

      span {
        margin-left: 10px;
      }

      img {
        height: 50px;
        width: 50px;
        border-radius: 50px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;

    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .bgcIsGree {
    background-color: #2a2a2a;
  }

  .hasBgImg {
    background-image: url("../assets/tobii_bg.png");
  }

  .toggle_button {
    color: #fff;
    background-color: #4a5064;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: 0.2em; //字间距
    cursor: pointer; //鼠标放上面 有个小手
  }
</style>
