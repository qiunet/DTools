<template>
  <el-divider />
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input clearable v-model="md5Context" st placeholder="输入字符串,得到MD5加密字符串!"/>
      </el-col>
      <el-col :span="5">
        <el-popover
            placement="right-start" :width="200" trigger="click" :content="md5Code">
          <template #reference>
            <el-button type="success" class="convert-btn" @click="md5HashCode">MD5加密</el-button>
          </template>
        </el-popover>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input clearable v-model="sha1Context" st placeholder="输入字符串,得到SHA1加密字符串!"/>
      </el-col>
      <el-col :span="5">
        <el-popover
            placement="right-start" :width="200" trigger="click" :content="sha1Code">
          <template #reference>
            <el-button type="success" class="convert-btn" @click="sha1HashCode">SHA1加密</el-button>
          </template>
        </el-popover>
      </el-col>
    </el-row>
  <el-divider />
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {ElMessage} from "element-plus/es";


  const md5Context = ref('');
  const sha1Context = ref('');
  const md5Code = ref();
  const sha1Code = ref();
  function md5HashCode() {
    if (md5Context.value === undefined) {
      ElMessage.error("输入值为空!")
    }
    md5Code.value = ""+window.tool_api.md5(md5Context.value);
    navigator.clipboard.writeText(md5Code.value).then(() => {
      ElMessage.success("复制成功");
    });
  }

  function sha1HashCode() {
    if (sha1Context.value === undefined) {
      ElMessage.error("输入值为空!")
    }
    sha1Code.value = ""+window.tool_api.sha1(sha1Context.value);
    navigator.clipboard.writeText(sha1Code.value).then(() => {
      ElMessage.success("复制成功");
    });
  }

</script>

<style scoped>

</style>
