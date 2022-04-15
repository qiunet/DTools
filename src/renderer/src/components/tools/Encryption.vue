<template>
  <el-divider />
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input clearable v-model="context" st placeholder="输入字符串,得到MD5加密字符串!"/>
      </el-col>
      <el-col :span="5">
        <el-popover
            placement="right-start" :width="200" trigger="click" :content="hashCode">
          <template #reference>
            <el-button type="success" class="convert-btn" @click="md5HashCode">MD5加密</el-button>
          </template>
        </el-popover>
      </el-col>
    </el-row>
  <el-divider />
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {ElMessage} from "element-plus/es";


  const context = ref('');
  const hashCode = ref();
  function md5HashCode() {
    if (context.value === undefined) {
      ElMessage.error("输入值为空!")
    }
    hashCode.value = ""+window.tool_api.md5(context.value);
    navigator.clipboard.writeText(hashCode.value).then(() => {
      ElMessage.success("复制成功");
    });
  }

</script>

<style scoped>

</style>
