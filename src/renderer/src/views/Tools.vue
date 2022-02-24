<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="Json工具" name="json">
      <v-json />
    </el-tab-pane>
    <el-tab-pane label="时间工具" name="time">
      <v-time />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {ref} from "vue";
import vJson from "../components/tools/Json.vue";
import vTime from "../components/tools/Time.vue";

export default {
  name: "Tools",

  components: {vJson, vTime},

  setup() {
    const activeName = ref('json')

    return {
      activeName
    }
  }
}
</script>

<style scoped>

</style>
