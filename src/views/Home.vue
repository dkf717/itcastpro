<template>
  <div class="home">
    <el-container>
      <el-aside :width="collapse?'64px':'200px'">
        <img class="logo">
        <el-menu
          :collapse="collapse"
          :router="true"
          :unique-opened="true"
          :collapse-transition="false"
          default-active="2"
          class="el-menu-vertical-demo"

          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for="first in leftrightlist" :key="first.id" :index="first.path">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span>{{first.authName}}</span>
            </template>
            <el-menu-item v-for="second in first.children" :key="second.id" :index="'/home/'+second.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{second.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="myicon myicon-menu toggle-btn" @click="collapse=!collapse"></span>
          <span class="system-title">电商后台管理系统</span>
          <div class="welcome">
            <span>你好：admin</span>
            <a href="javascript:;">退出</a>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getaxios } from '@/api/axios.js'
export default {
  data () {
    return {
      collapse: false,
      leftrightlist: []
    }
  },
  methods: {

  },
  mounted () {
    getaxios('menus').then(result => {
      this.leftrightlist = result.data.data
      console.log(this.leftrightlist)
    })
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    width: 100%;
    height: 60px;
    background: url("../assets/logo.png");
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
