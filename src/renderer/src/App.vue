<template>
  <el-container>
    <el-aside id="toolBox" width="80px">
      <v-side-bar />
    </el-aside>
    <el-main>
      <el-container style="height: 100%">
        <el-header height="30px">
          <el-divider class="content-area-title" content-position="left">{{ this.$route.meta.title }}</el-divider>
        </el-header>
        <el-main style="overflow-y: hidden">
          <div id="content" style="padding-top: 15px">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts" >
import vSideBar from './components/SideBar.vue';

export default {
  name: "App",

  components: {
    vSideBar,
  },
}
</script>

<style>
@import "assets/css/main.css";
</style>
