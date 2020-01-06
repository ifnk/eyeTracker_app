<template>
  <div id="app">
    <!--路由占位符 通过路由匹配 的这些组件都会 被渲染到router-view 里面 去展示 -->
    <!--把登录组件渲染到app根组件当中 -->
    <router-view></router-view>

  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
</style>
