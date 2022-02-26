<template>
  <div>
    <el-row style="padding-top: 20px">
      <el-col :span="5">职业:</el-col>
      <el-col :span="17">
        <el-select class="setting-el-select" v-model="data.setting.role" placeholder="选择职业" size="large" @change="roleChange">
          <el-option
              v-for="item in data.roles"
              :key="item.name"
              :label="item.name"
              :value="item.role"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-divider></el-divider>

    <el-row>
      <el-col :span="5">
        上传模板
      </el-col>
      <el-col :span="17">
        <el-upload
            drag
            action="/"
            accept=".ejs"
            auto-upload: false
            :before-upload="uploadFile">
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            拖拽ejs模板文件到这里 或者 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              允许上传ejs模板文件!
            </div>
          </template>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import { UploadFilled, Close, Plus } from "@element-plus/icons-vue";
import {ElNotification} from "element-plus/es";
import {Role} from "../common/Enums";
import {ElMessage} from "element-plus";

let data = reactive({
  roles: [{
    "role": Role.CLIENT,
    "name": "客户端"
  }, {
    "role": Role.SERVER,
    "name": "服务端"
  }, {
    "role": Role.OTHER,
    "name": "其它"
  }],
  setting: window.tool_api.setting(),
});

function roleChange(index: number) {
  window.tool_api.roleChange(data.roles[index].role).then(() => {
    data.setting.role = data.roles[index].role;
    ElMessage.success("切换成功!")
  });
}
/**
 * 上传文件
 * @param file
 */
function uploadFile(file: any): boolean {
  window.tool_api.copyToEjsDir(file.path).then(() => {
    ElNotification({
      title: '上传成功',
      duration: 1000,
      message: file.name,
      type: 'success',
      showClose: false
    })
  });
  return false;
}
</script>

<style scoped>
.setting-save {
  width: 100%;
  float: right;
}
</style>
