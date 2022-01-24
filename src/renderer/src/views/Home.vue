<template>
  <el-container class="root-container" @click="closeMenu">
    <el-header height="100px">
      <div style="padding: 10px; font-size: 22px; color: gray">
        <el-row :gutter="5">
          <el-col :span="4">配置目录:</el-col>
          <el-col :span="17" style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis">{{ data.setting.currCfgPath }}</el-col>
        </el-row>
        <el-row :gutter="2" style="padding-top: 10px">
          <el-col :span="4">项目目录:</el-col>
          <el-col :span="17" style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis">{{data.setting.currProjectPath }}</el-col>
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
            default-expand-all
            @node-click="closeMenu"
            @node-contextmenu="openMenu"
            :props="data.defaultProps"
            :highlight-current="true"
            :filter-node-method="data.filterNode"
        >
        </el-tree>
        <v-contextmenu ref="contextmenu">
          <v-contextmenu-item @click="menuClick('open')">打开</v-contextmenu-item>
          <v-contextmenu-item @click="menuClick('convert')">转换</v-contextmenu-item>
          <v-contextmenu-divider></v-contextmenu-divider>
          <v-contextmenu-item @click="menuClick('update')">更新</v-contextmenu-item>
          <v-contextmenu-item @click="menuClick('commit')">提交</v-contextmenu-item>
        </v-contextmenu>
      </el-aside>
      <el-main class="el-main" style="height: 100%">
        <div class="content_area">
          <el-container style="height: 100%">
            <el-header height="22px"><el-divider content-position="left" border-style="color: #324157;">控制台</el-divider></el-header>
            <el-main>
              <div style="padding: 15px 5px 5px 10px; height: 96%; float: bottom; color: darkgray; font-size: 16px" v-html="data.consoleContent"/>
            </el-main>
          </el-container>
        </div>
      </el-main>
    </el-container>
  </el-container>

</template>

<script lang="ts">
import {getCurrentInstance, reactive, ref, watch} from "vue";
import {ElMessage, ElTree} from "element-plus";
import {Contextmenu, ContextmenuDivider, ContextmenuItem, directive} from "v-contextmenu";
import "v-contextmenu/dist/themes/default.css";
import {IFileNode} from "../common/IFileNode";
import {SvnEvent} from "../common/Enums";

export default {
  components: {
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
    [ContextmenuDivider.name]: ContextmenuDivider,
  },

  directives: {
    contextmenu: directive,
  },

  setup() {
    let data = reactive({
      setting: window.tool_api.setting(),
      files: window.tool_api.cfgFileNode(),
      consoleAppend: (content: string) => {
        content = content.replaceAll("\n", "<br />");
        data.consoleContent += (content);
      },
      filterNode : (value: string, data: IFileNode) => {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },

      consoleContent: "",
      defaultProps : {
        children: 'children',
        label: 'name',
      },
    });

    let currNode = ref<IFileNode>();
    const internalInstance:any = getCurrentInstance()

    /**
     * 关闭右键菜单
     */
    function closeMenu() {
      let refs:any = internalInstance.refs;
      refs.contextmenu.hide();
    }

    /**
     * 打开菜单
     * @param event
     * @param node
     * @param data
     */
    function openMenu(event: PointerEvent, node: any, data: any) {
      currNode.value = (data.data);
      let refs:any = internalInstance.refs;
      refs.contextmenu.show({ top: event.clientY, left: event.clientX});
    }

    /**
     * 点击菜单项
     * @param event
     */
    function menuClick(event: string){
      let node = currNode.value;
      if (node === undefined) {
        ElMessage.error("上下文错误");
        return;
      }
      switch (event) {
        case 'open':
          window.tool_api.openPath(node.fullPath);
          break;
        case 'convert':
          window.tool_api.convert(node.fullPath, (str: string) => {
            data.consoleAppend(str);
          });
          break;
        case 'update':
          window.tool_api.svnClient(SvnEvent.UPDATE, node.fullPath).then(data.consoleAppend).catch(data.consoleAppend);
          break;
        case 'commit':
          window.tool_api.svnClient(SvnEvent.COMMIT, node.fullPath).then(data.consoleAppend).catch(data.consoleAppend);
          break;
      }
      closeMenu();
    }
    const filterText = ref('');
    const treeRef = ref<InstanceType<typeof ElTree>>()

    watch(filterText, (val) => {
      treeRef.value!.filter(val)
    })

    return {
      data,
      treeRef,
      filterText,
      menuClick,
      openMenu,
      closeMenu
    }
  }
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
</style>
