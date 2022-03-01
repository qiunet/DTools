<template>
  <div>
    <el-row style="padding-top: 20px">
      <el-col :span="5">职业:</el-col>
      <el-col :span="17">
        <el-select class="setting-el-select" v-model="setting.role" placeholder="选择职业" size="large" @change="roleChange">
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
    <el-row style="padding-top: 20px">
      <el-col :span="5">Proto:</el-col>
      <el-col :span="17"><v-choice-selector placeholder="填入'AllInOneProtobufProtocol.proto'文件路径" :select="setting.protoFilePath" :newValCheck="protoCheck" /></el-col>
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
import {reactive, ref} from "vue";
import { UploadFilled} from "@element-plus/icons-vue";
import {ElNotification} from "element-plus/es";
import {Role} from "../common/Enums";
import {ElMessage} from "element-plus";
import vChoiceSelector from "../components/ChoiceSelector.vue";

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
});
const setting = ref(window.tool_api.setting());

function roleChange(index: number) {
  window.tool_api.roleChange(data.roles[index].role).then(() => {
    setting.value.role = data.roles[index].role;
    ElMessage.success("切换成功!")
  });
}

function protoCheck(val: string): boolean {
  if (! val.endsWith("AllInOneProtobufProtocol.proto")) {
    ElMessage.error("必须是 AllInOneProtobufProtocol.proto 文件");
    return false;
  }
  if (! window.tool_api.fileExists(val)) {
    ElMessage.error("文件["+val+"]路径不存在");
    return false;
  }
  return true;
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
