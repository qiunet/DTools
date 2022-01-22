<template>
  <div>
    <el-row style="padding-top: 20px">
      <el-col :span="5">职业:</el-col>
      <el-col :span="17">
        <el-select class="setting-el-select" v-model="data.setting.role" placeholder="选择职业" size="small" @change="data.roleChange">
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
      <el-col :span="5">配置路径:</el-col>
      <el-col :span="12">
        <el-select class="setting-el-select" v-model="data.setting.currCfgPath" placeholder="选择Excel配置路径" size="small">
          <el-option
              v-for="item in data.setting.cfgPaths"
              :key="item"
              :label="item"
              :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1"><el-icon class="icon-button" size="20"><Plus /></el-icon></el-col>
      <el-col :span="1"><el-icon class="icon-button" size="20"><Close /></el-icon></el-col>
    </el-row>
    <el-row :gutter="2" style="margin-top: 10px">
      <el-col :span="5">项目路径:</el-col>
      <el-col :span="12">
        <el-select class="setting-el-select" v-model="data.setting.currProjectPath" placeholder="选择项目路径" size="small">
          <el-option
              v-for="item in data.setting.projectPaths"
              :key="item"
              :label="item"
              :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1"><el-icon class="icon-button" size="20"><Plus /></el-icon></el-col>
      <el-col :span="1"><el-icon class="icon-button" size="20"><Close /></el-icon></el-col>
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
            :before-upload="data.uploadFile"
            class="upload-demo">
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            拖拽文件到这里 或者 <em>点击上传</em>
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

<script lang="ts">
import {reactive} from "vue";
import { UploadFilled, Close, Plus } from "@element-plus/icons-vue";
import {ElNotification} from "element-plus/es";
import {Role} from "../common/Enums";

export default {
  name: "Setting",

  components: {UploadFilled, Close, Plus},

  setup() {
    let data = reactive({
      roles: [{
        "role": Role.CLIENT,
        "name": "客户端"
      }, {
        "role": Role.SERVER,
        "name": "服务端"
      },{
        "role": Role.OTHER,
        "name": "其它"
      }],
      setting: window.tool_api.setting(),

      roleChange: function (index: number) {
        window.tool_api.roleChange(data.roles[index].role).then(() => {
          data.setting.role = data.roles[index].role;
          ElNotification({
            title: '更新成功',
            duration: 1000,
            message: Role[data.setting.role].toString(),
            type: 'success',
            showClose: false
          })
        });
      },
      /**
       * 上传文件
       * @param file
       */
      uploadFile: function(file: any):boolean {
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
      },

    });

    return {
      data,
    }
  }
}
</script>

<style scoped>
.setting-el-select {
  width: 400px;
}
.setting-save {
  width: 100%;
  float: right;
}

.setting-save>button {
  float: right;
  margin-right: 50px;
  color: mediumseagreen;
}
</style>
