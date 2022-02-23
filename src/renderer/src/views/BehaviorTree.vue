<template>
  <el-container style="height: 100%; padding: 0;">
    <el-aside width="250px">
      <el-container style="height: 100%; padding: 0;">
        <el-main>
          <el-input v-model="filterText" placeholder="过滤" />
          <el-tree
              style="height: 100%"
              ref="treeRef"
              node-key="fullPath"
              :data="data.files"
              class="filter-tree"
              @node-click="open = false"
              @node-contextmenu="rightClick"
              default-expand-all
              :props="data.defaultProps"
              :highlight-current="true"
              :filter-node-method="data.filterNode"
          >
          </el-tree>
          <vue3-menus :open="open" :event="event" :menus="menus">
            <template #label="{menu, index, activeIndex}">{{ menu.label }}</template>
          </vue3-menus>
        </el-main>
        <el-footer height="50px">
          <el-button type="success" style="width: 249px" @click="newAiFormVisible = true">新建</el-button>

          <el-dialog v-model="newAiFormVisible" title="新建ai行为树xml文件">
            <el-form :model="newAiForm">
              <el-form-item label="文件名" label-width="140px">
                <el-input maxlength="13" placeholder="文件名" v-model="newAiForm.filename" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="AI描述" label-width="140px">
                <el-input maxlength="20" placeholder="ai 配置的描述" v-model="newAiForm.rootDesc" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
              <el-button @click="newAiFormVisible = false">Cancel</el-button>
              <el-button type="primary" @click="newAiForm.editAiFile">Confirm</el-button>
            </span>
            </template>
          </el-dialog>
        </el-footer>
      </el-container>
    </el-aside>
    <el-main>
      <el-row :gutter="5">
        <el-col :span="5" style="padding: 8px 0 0 20px;">行为树配置文件夹:</el-col>
        <el-col :span="12">
          <el-select
              class="setting-el-select"
              v-model="data.setting.aiCfgPathSelect.current"
              filterable
              size="large"
              allow-create
              :clearable="true"
              default-first-option
              :reserve-keyword="false"
              @clear="data.aiCfgPathClear"
              @change="data.aiCfgSelectChange"
              no-data-text="需要填入配置文件夹绝对路径"
              placeholder="需要填入配置文件夹绝对路径"
          >
            <el-option
                v-for="item in data.setting.aiCfgPathSelect.list"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="5"></el-col>
        <el-col :span="12">
          <el-upload
              drag
              action="/"
              accept=".json"
              auto-upload: false
              :before-upload="data.uploadFile">
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              拖拽AiConfig.json文件到这里 或者 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                允许上传AiConfig.json模板文件!
              </div>
            </template>
          </el-upload>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {nextTick, reactive, ref, watch} from "vue";
import {ElMessage, ElNotification} from "element-plus";
import {UploadFilled} from "@element-plus/icons-vue";
import {IFileNode} from "../common/IFileNode";
import {ElTree} from "element-plus/es";
import {StringUtil} from "../common/StringUtil";
import {useRouter} from "vue-router";
import {RClickMenu} from "../common/RClickMenu";

export default {
  components: {UploadFilled},

  mounted() {
    if (window.tool_api.setting().aiCfgPathSelect.current === '') {
      ElMessage.warning("请先设置项目中AI配置的路径文件夹")
    }
  },

  setup() {
    const data = reactive({
      setting: window.tool_api.setting(),
      files: window.tool_api.aiCfgFileNode(),

      filterNode : (value: string, data: IFileNode) => {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },

      aiCfgPathClear() {
        window.tool_api.removeAiCfgPath();
        data.setting = window.tool_api.setting();
        data.files = window.tool_api.aiCfgFileNode();
      },

      aiCfgSelectChange(val: string) {
        if (StringUtil.isEmpty(val)) {
          return;
        }

        if (! window.tool_api.isDir(val)) {
          ElMessage.error("["+val+"]不是一个文件夹!");
          return false;
        }

        if (window.tool_api.useAiConfigPath(val)) {
          data.setting.aiCfgPathSelect.list.push(val);
          ElMessage.success("保存成功!");
        }else {
          ElMessage.success("切换成功!");
        }

        data.files = window.tool_api.aiCfgFileNode();
      },

      defaultProps : {
        children: 'children',
        label: 'name',
      },
      /**
       * 上传文件
       * @param file
       */
      uploadFile: function(file: any):boolean {
        if (! file.path.endsWith("AiConfig.json")) {
          ElMessage.error("仅支持AiConfig.json文件!");
          return false;
        }

        window.tool_api.copyToAiCfgDir(file.path).then(() => {
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
    });
    const filterText = ref('');
    const treeRef = ref<InstanceType<typeof ElTree>>()

    watch(filterText, (val) => {
      treeRef.value!.filter(val)
    })

    let currNode: IFileNode | any = null;
    const open = ref(false);
    const event = ref({});


    function rightClick(e: PointerEvent, node: any, data: any) {
      if (! data.data.fullPath.endsWith(".xml")) {
        return false;
      }

      open.value = false;
      nextTick(() => {
        currNode = (data.data);
        event.value = e;
        open.value = true;
      })
      e.preventDefault();
    }

    const router = useRouter();
    const menus = ref([
        new RClickMenu("编辑", "编辑AI逻辑", () => {
          if (! window.tool_api.fileExists(window.tool_api.aiConfigFilePath())) {
            ElMessage.error("AiConfig.json 没有上传!")
            return false;
          }
          router.push("/BhtEdit/"+ currNode.name)
        }, '', () => {
          return currNode != null && currNode.dir;
        })
    ]);
    const newAiFormVisible = ref(false)
    const newAiForm = reactive({
      filename: '',
      rootDesc: '',

      editAiFile() {
        if (newAiForm.filename === '' || newAiForm.rootDesc === '') {
          ElMessage.error("文件名和描述不能为空!")
          return false;
        }

        if (! window.tool_api.fileExists(window.tool_api.aiConfigFilePath())) {
          ElMessage.error("AiConfig.json 没有上传!")
          return false;
        }

        if (! window.tool_api.createAiXmlFile(newAiForm.filename, newAiForm.rootDesc)) {
          ElMessage.error(newAiForm.filename + "已经存在!")
          return false;
        }

        router.push("/BhtEdit/"+newAiForm.filename + ".xml")
        newAiFormVisible.value = false;
      },
    });

    return {
      data,
      open,
      event,
      menus,
      treeRef,
      newAiForm,
      filterText,
      rightClick,
      newAiFormVisible
    };
  },
}
</script>

<style scoped>
  .setting-el-select {
    width: 400px;
  }

</style>
