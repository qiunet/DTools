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
          <el-button type="success" style="width: 249px" @click="newAiForm.newAiFormVisible = true">新建</el-button>

          <el-dialog v-model="newAiForm.newAiFormVisible" title="新建ai行为树xml文件">
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
              <el-button @click="newAiForm.newAiFormVisible = false">Cancel</el-button>
              <el-button type="primary" @click="newAiForm.editAiFile">Submit</el-button>
            </span>
            </template>
          </el-dialog>
        </el-footer>
      </el-container>
    </el-aside>
    <el-main>
      <el-row :gutter="5">
        <el-col :span="5" style="padding: 8px 0 0 20px;">AI XML配置:</el-col>
        <el-col :span="12">
          <v-choice-selector :del-select="reloadAiFileNode" :use-func="reloadAiFileNode" :select="data.setting.aiCfgPathSelect" />
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="5"  style="padding: 8px 0 0 20px;">AiConfig.json</el-col>
        <el-col :span="12">
          <v-choice-selector :del-select="reloadAiCfgJson" :use-func="reloadAiCfgJson" :newValCheck="checkAiConfigJson" :select="data.setting.aiJsonCfgPathSelect" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref, watch} from "vue";
import {ElMessage, ElNotification} from "element-plus";
import {UploadFilled} from "@element-plus/icons-vue";
import {IFileNode} from "../common/IFileNode";
import {ElTree} from "element-plus/es";
import {useRouter} from "vue-router";
import {RClickMenu} from "../common/RClickMenu";
import vChoiceSelector from "../components/ChoiceSelector.vue";

let currNode: IFileNode | any = null;
const open = ref(false);
const event = ref({});

const router = useRouter();
const data = reactive({
  setting: window.tool_api.setting(),
  files: window.tool_api.aiCfgFileNode(),
  defaultProps : {
    children: 'children',
    label: 'name',
  },
  filterNode: (value: string, data: IFileNode) => {
  if (!value) return true
  return data.name.indexOf(value) !== -1
}
});

function reloadAiFileNode() {
  data.files = window.tool_api.aiCfgFileNode();
}


function reloadAiCfgJson() {
  window.tool_api.aiConfigJsonReload();
}
/**
* 上传文件
* @param file
*/
function checkAiConfigJson(val: any):boolean {
  if (! val.endsWith("AiConfig.json")) {
    ElMessage.error("仅支持AiConfig.json文件!");
    return false;
  }

  if (! val.startsWith("http") && !window.tool_api.fileExists(val)) {
    ElMessage.error("文件不存在!");
    return false;
  }

  return true;
}
const filterText = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>()

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

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

const menus = ref([
    new RClickMenu("编辑", "编辑AI逻辑", () => {
      if (data.setting.aiJsonCfgPathSelect.current === '') {
        ElMessage.error("AiConfig.json 没有上传!")
        return false;
      }
      router.push("/BhtEdit/"+ currNode.name)
    }, '', () => {
      return currNode != null && currNode.dir;
    })
]);

const newAiForm = reactive({
  newAiFormVisible: false,
  filename: '',
  rootDesc: '',

  editAiFile() {
    if (newAiForm.filename === '' || newAiForm.rootDesc === '') {
      ElMessage.error("文件名和描述不能为空!")
      return false;
    }

    if (data.setting.aiJsonCfgPathSelect.current === '') {
      ElMessage.error("AiConfig.json 没有上传!")
      return false;
    }

    if (! window.tool_api.createAiXmlFile(newAiForm.filename, newAiForm.rootDesc)) {
      ElMessage.error(newAiForm.filename + "已经存在!")
      return false;
    }

    router.push("/BhtEdit/"+newAiForm.filename + ".xml")
    newAiForm.newAiFormVisible = false;
  },
});

if (data.setting.aiJsonCfgPathSelect.current !== '') {
  window.tool_api.aiConfigJsonReload()
}
</script>

<style scoped>
  .setting-el-select {
    width: 400px;
  }
  .el-main {
    padding: 0;
  }

</style>
