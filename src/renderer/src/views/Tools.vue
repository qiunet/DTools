<template>
  <el-tabs v-model="activeName" style="margin: 10px 0 0 50px">
    <el-tab-pane label="Json工具" name="json"><v-json /></el-tab-pane>
    <el-tab-pane label="时间工具" name="time"><v-time /></el-tab-pane>
    <el-tab-pane label="Regex工具" name="regex"><v-regex /></el-tab-pane>
    <el-tab-pane label="HashCode" name="hashcode"><v-hash-code /></el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import {ref} from "vue";
  import vJson from "../components/tools/Json.vue";
  import vTime from "../components/tools/Time.vue";
  import vRegex from "../components/tools/Regex.vue";
  import vHashCode from "../components/tools/HashCode.vue";

    const activeName = ref('json')
</script>

<style scoped>

</style>
