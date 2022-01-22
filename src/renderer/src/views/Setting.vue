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
        <el-select
            class="setting-el-select"
            v-model="data.setting.currCfgPath"
            filterable
            allow-create
            default-first-option
            @change="data.cfgSelectChange"
            :reserve-keyword="false"
            no-data-text="需要填入配置文件夹绝对路径"
        >
          <el-option
              v-for="item in data.setting.cfgPaths"
              :key="item"
              :label="item"
              :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="2" style="margin-top: 10px">
      <el-col :span="5">项目路径:</el-col>
      <el-col :span="12">
        <el-select
            class="setting-el-select"
            v-model="data.setting.currProjectPath"
            filterable
            allow-create
            default-first-option
            @change="data.projectPathChange"
            :reserve-keyword="false"
            no-data-text="需要填入输出文件夹绝对路径"
        >
          <el-option
              v-for="item in data.setting.projectPaths"
              :key="item"
              :label="item"
              :value="item"
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
            :before-upload="data.uploadFile">
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
import {ElMessage} from "element-plus";
let element = document.getElementsByClassName("el-upload__input")
for (let index = 0; index < element.length; index ++) {
    let item:any = element.item(index);
    item.webkitdirectory = true;
}

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

      cfgSelectChange: function (val: any) {
        if (! window.tool_api.isDir(val)) {
          ElMessage.error("["+val+"]不是一个文件夹!");
          return false;
        }
        data.setting.currCfgPath = val;
        if (window.tool_api.useCfgPath(val)) {
          data.setting.cfgPaths.push(val);
          ElMessage.success("保存成功!");
        }else {
          ElMessage.success("切换成功!");
        }
      },

      projectPathChange: function (val: any) {
        if (! window.tool_api.isDir(val)) {
          ElMessage.error("["+val+"]不是一个文件夹!");
          return false;
        }

        data.setting.currProjectPath = val;
        if (window.tool_api.useProjectPath(val)) {
          data.setting.projectPaths.push(val);
          ElMessage.success("保存成功!");
        } else {
          ElMessage.error("切换成功!");
        }
      },

      roleChange: function (index: number) {
        window.tool_api.roleChange(data.roles[index].role).then(() => {
          data.setting.role = data.roles[index].role;
          ElMessage.success("切换成功!")
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
  width: 500px;
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
