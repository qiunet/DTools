<template>
  <el-container class="root-container">
    <el-header height="100px">
      <div style="padding: 10px; font-size: 22px; color: gray">
        <el-row>
          <el-col :span="5">配置路径:</el-col>
          <el-col :span="19">
            <v-choice-selector :size="'default'" :select="data.setting.cfgPathSelect" :use-func="reloadCfgFileNode" :del-select="reloadCfgFileNode" :styleData="{width: '100%'}" />
          </el-col>
        </el-row>
        <el-row  style="width: 100%; margin-top: 10px" :gutter="2">
          <el-col :span="5">项目路径:</el-col>
          <el-col :span="19">
            <v-choice-selector :size="'default'" :select="data.setting.projectPathSelect" :styleData="{width: '100%'}" />
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-container>
      <el-aside id="tools-sidebar" width="250px" style="border-radius: 2px;">
        <el-input v-model="filterText" placeholder="过滤" />
        <el-tree
            style="height: 100%;"
            ref="treeRef"
            node-key="fullPath"
            :data="data.files"
            class="filter-tree"
            @node-click="open = false"
            @node-contextmenu="rightClick"
            default-expand-all
            :props="data.defaultProps"
            :highlight-current="true"
            :filter-node-method="filterNode"
        >
        </el-tree>
        <vue3-menus :open="open" :event="event" :menus="menus">
          <template #label="{menu, index, activeIndex}">{{ menu.label }}</template>
        </vue3-menus>
      </el-aside>
      <el-main class="el-main" style="height: 100%">
        <div class="content_area">
          <el-container style="height: 100%">
            <el-header height="22px"><el-divider content-position="left" border-style="color: #324157;">控制台</el-divider></el-header>
            <el-main>
              <textarea id="console-content-area" disabled style="padding: 15px 5px 5px 10px; height: 96%; width: 98%; float: bottom; color: darkgray; resize: none; font-size: 16px" v-html="data.consoleContent"></textarea>
            </el-main>
          </el-container>
        </div>
      </el-main>
    </el-container>
  </el-container>

</template>

<script lang="ts" setup>
import {reactive, nextTick, ref, watch} from "vue";
import {ElTree} from "element-plus";
import {IFileNode} from "../common/IFileNode";
import {SvnEvent} from "../common/Enums";
import {RClickMenu} from "../common/RClickMenu";
import vChoiceSelector from "../components/ChoiceSelector.vue";

    const data = reactive({
      setting: window.tool_api.setting(),
      files: window.tool_api.cfgFileNode(),
      consoleContent: "",
      defaultProps : {
        children: 'children',
        label: 'name',
      },
    });

    function consoleAppend(content: string) {
      data.consoleContent += (content);
      let element: any = document.getElementById("console-content-area");
      element.scrollTop = element.scrollHeight + 500;
    }

    function filterNode(value: string, data: IFileNode) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }

    const filterText = ref('');
    const treeRef = ref<InstanceType<typeof ElTree>>()

    watch(filterText, (val) => {
      treeRef.value!.filter(val)
    })

    let currNode: any;
    const open = ref(false);
    const event = ref({});
    function rightClick(e: PointerEvent, node: any, data: any) {
      open.value = false;
      nextTick(() => {
        currNode = (data.data);
        event.value = e;
        open.value = true;
      })
      e.preventDefault();
    }

    const menus = ref([
      new RClickMenu("打开", '打开文件',
          () => {
            window.tool_api.openPath(currNode.fullPath);
          },
          '<svg focusable="false" class="icon" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M275.84 160H124.192l1.824 580.096a32 32 0 0 1-64 0L60.16 160a64 64 0 0 1 64-64h177.92l97.28 96h498.272a32 32 0 1 1 0 64H373.152l-97.28-96z" fill="#515151"></path><path d="M127.52 735.616a32 32 0 0 1-63.04-10.944l54.624-314.144C127.904 359.936 174.784 320 225.76 320h668.864c55.36 0 93.92 46.72 84.384 101.472l-72.32 416C897.824 888.064 850.976 928 800 928H160a32 32 0 0 1 0-64h640c19.712 0 40.096-17.376 43.616-37.472l72.32-416c2.784-15.904-5.984-26.528-21.312-26.528H225.76c-19.68 0-40.096 17.376-43.584 37.472l-54.656 314.144z" fill="#515151"></path></svg>',
          () => false,
          true
      ),
      new RClickMenu("转换", "转换配置文件",
          () => {
            window.tool_api.convert(currNode.fullPath, (str: string) => {
              consoleAppend(str);
            });
          },
          '<svg focusable="false" class="icon" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M512 149.333333c200.298667 0 362.666667 162.368 362.666667 362.666667s-162.368 362.666667-362.666667 362.666667S149.333333 712.298667 149.333333 512 311.701333 149.333333 512 149.333333z m0 64c-164.949333 0-298.666667 133.717333-298.666667 298.666667s133.717333 298.666667 298.666667 298.666667 298.666667-133.717333 298.666667-298.666667-133.717333-298.666667-298.666667-298.666667z m86.997333 137.450667l116.117334 116.16-45.269334 45.248-61.845333-61.866667v242.709334h-64V373.546667l0.810667-5.76c1.152-7.210667 2.304-8.746667 8.64-17.024l7.168-3.925334c15.914667-8.469333 18.282667-7.168 38.378666 3.946667zM480.448 341.333333v319.488l-0.832 5.76c-1.130667 7.210667-2.282667 8.725333-8.618667 17.024l-7.168 3.904c-15.936 8.490667-18.282667 7.189333-38.4-3.925333L309.333333 567.424l45.269334-45.248 61.845333 61.866667V341.333333h64z" p-id="5021" fill="#515151"></path></svg>',
          () => false
      ),
      new RClickMenu("更新", 'SVN更新',
          () => {
            window.tool_api.svnClient(SvnEvent.UPDATE, currNode.fullPath).then(consoleAppend).catch(consoleAppend);
          },
          '<svg focusable="false" class="icon" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M549.546667 320v176.64l124.586666 124.586667a21.333333 21.333333 0 0 1 0 30.293333l-22.613333 22.613333a21.333333 21.333333 0 0 1-30.293333 0l-140.373334-140.373333a22.613333 22.613333 0 0 1-6.4-14.933333V320a21.333333 21.333333 0 0 1 21.333334-21.333333h32.426666a21.333333 21.333333 0 0 1 21.333334 21.333333z m346.453333 85.333333v-213.333333a21.333333 21.333333 0 0 0-21.333333-21.333333h-12.373334a20.906667 20.906667 0 0 0-15.36 6.4l-63.573333 63.573333A384 384 0 1 0 896 534.613333a21.333333 21.333333 0 0 0-5.546667-15.786666 22.186667 22.186667 0 0 0-15.36-6.826667h-42.666666a21.333333 21.333333 0 0 0-21.333334 20.053333A298.666667 298.666667 0 1 1 512 213.333333a295.68 295.68 0 0 1 210.346667 88.32l-75.946667 75.946667a20.906667 20.906667 0 0 0-6.4 15.36v12.373333a21.333333 21.333333 0 0 0 21.333333 21.333334h213.333334a21.333333 21.333333 0 0 0 21.333333-21.333334z" p-id="4024" fill="#515151"></path></svg>',
          () => false
      ),
      new RClickMenu( "提交", 'SVN提交',
          () => {
            window.tool_api.svnClient(SvnEvent.COMMIT, currNode.fullPath).then(consoleAppend).catch(consoleAppend);
          },
          '<svg focusable="false" class="icon" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M865.04 831.061l-416-128 416-480-544 480-320-128 1024-544-160 800z m-416 192v-224l128 64-128 160z" p-id="5857" fill="#515151"></path></svg>',
          () => currNode.dir
      )
    ]);
/**
 * cfg 路径变更
 */
function reloadCfgFileNode() {
  data.files = window.tool_api.cfgFileNode();
}

</script>

<style>
.el-main {
  padding: 0 5px 5px 5px;
}
.el-tree {
  user-select: none;
}
.root-container {
  height: 100%;
  width: 100%;
  border: 1px solid #eee;
  border-radius: 5px;
}

.vue3-menus-item {
  margin-top: 1rem;
  background-color: #eee;
  line-height: 7rem;
  height: 7rem;
  text-align: center;
}
</style>
